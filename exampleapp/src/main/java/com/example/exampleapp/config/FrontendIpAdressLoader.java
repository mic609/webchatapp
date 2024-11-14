package com.example.exampleapp.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class FrontendIpAdressLoader {

    @Value("classpath:frontend_ip_address_config.json")
    private org.springframework.core.io.Resource frontendIpAddressConfigResource;

    @Bean
    public FrontendIpAddress frontendIpAdressLoader() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(frontendIpAddressConfigResource.getInputStream(), FrontendIpAddress.class);
    }
}