package com.example.exampleapp.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDto {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private String sender;
    private String receiver;
}