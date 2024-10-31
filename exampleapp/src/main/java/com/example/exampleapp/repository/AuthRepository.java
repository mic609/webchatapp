package com.example.exampleapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.exampleapp.model.Authority;

public interface AuthRepository extends JpaRepository<Authority, Long> {
    List<Authority> findByUsername(String username);
}