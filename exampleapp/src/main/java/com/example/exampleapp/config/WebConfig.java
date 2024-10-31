package com.example.exampleapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// @EnableWebMvc
// public class WebConfig implements WebMvcConfigurer {

//     @Override
//     public void addCorsMappings(CorsRegistry registry) {
//         registry.addMapping("/**") // zezwolenie na wszystkie ścieżki
//                 .allowedOrigins("http://localhost:4200") // dozwolone źródło
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // dozwolone metody HTTP
//                 .allowedHeaders("Authorization", "Content-Type", "*") // dozwolone nagłówki
//                 .exposedHeaders("Authorization") // ujawnij nagłówki
//                 .allowCredentials(true); // pozwól na uwierzytelnianie
//     }
// }