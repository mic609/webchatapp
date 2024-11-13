package com.example.exampleapp.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class CognitoConfigLoader {

    @Value("classpath:cognito_config.json")
    private org.springframework.core.io.Resource cognitoConfigResource;

    @Bean
    public CognitoConfig cognitoConfig() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(cognitoConfigResource.getInputStream(), CognitoConfig.class);
    }
}