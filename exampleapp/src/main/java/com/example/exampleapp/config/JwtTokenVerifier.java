package com.example.exampleapp.config;

import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenVerifier extends OncePerRequestFilter {

    @Value("${cognito.jwks-url}")
    private String jwksUrl;

    private RSAPublicKey publicKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.replace("Bearer ", "");
        try {
            publicKey = getPublicKeyFromJWKS(request);

            Claims claims = Jwts.parser()
                    .setSigningKey(publicKey) // Weryfikacja podpisu JWT
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.get("cognito:username", String.class);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    username, null, List.of()
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } catch (SignatureException e) {
            throw new RuntimeException("Token verification failed", e);
        }

        filterChain.doFilter(request, response);
    }

    private RSAPublicKey getPublicKeyFromJWKS(HttpServletRequest request) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        String jwks = restTemplate.getForObject(jwksUrl, String.class);

        JSONObject jwksJson = new JSONObject(jwks);
        String kid = getKidFromToken(request);

        for (Object keyObj : jwksJson.getJSONArray("keys")) {
            JSONObject keyJson = (JSONObject) keyObj;
            if (keyJson.getString("kid").equals(kid)) {
                return buildRSAPublicKeyFromJSON(keyJson);
            }
        }

        throw new RuntimeException("Public key not found for kid: " + kid);
    }

    private RSAPublicKey buildRSAPublicKeyFromJSON(JSONObject keyJson) {
        try {
            String modulus = keyJson.getString("n");
            String exponent = keyJson.getString("e");

            // Dekodowanie Base64
            byte[] modulusBytes = Base64.getUrlDecoder().decode(modulus);
            byte[] exponentBytes = Base64.getUrlDecoder().decode(exponent);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPublicKey rsaPublicKey = (RSAPublicKey) keyFactory.generatePublic(
                new RSAPublicKeySpec(new BigInteger(1, modulusBytes), new BigInteger(1, exponentBytes))
            );

            return rsaPublicKey;
        } catch (Exception e) {
            throw new RuntimeException("Error while building RSA public key", e);
        }
    }

    private String getKidFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String[] splitToken = token.split("\\.");
        String header = new String(Base64.getDecoder().decode(splitToken[0]));

        JSONObject headerJson = new JSONObject(header);
        return headerJson.getString("kid");
    }
}