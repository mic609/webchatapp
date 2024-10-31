package com.example.exampleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;
import com.example.exampleapp.config.JwtUtil;
import com.example.exampleapp.dto.JwtResponseDto;
import com.example.exampleapp.dto.ResponseMessageDto;
import com.example.exampleapp.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;


@Service
public class AuthService {
    
    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;
    private UserDetailsService userDetailsService;
    private JdbcUserDetailsManager userDetailsManager;
    private PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsService userDetailsService,
     JdbcUserDetailsManager userDetailsManager, PasswordEncoder passwordEncoder){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseMessageDto register(UserDto userDto) {
        if (userDetailsManager.userExists(userDto.getUsername())) {
            throw new IllegalStateException("User already exists");
        }

        UserDetails user = org.springframework.security.core.userdetails.User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .roles("USER")
                .build();

        userDetailsManager.createUser(user);
        return new ResponseMessageDto("User registered successfully");
    }

    public JwtResponseDto login(UserDto userDto) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        return new JwtResponseDto(jwt);
    }

    public ResponseMessageDto logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        request.getSession().invalidate();
        return new ResponseMessageDto("User logged out successfully");
    }
}