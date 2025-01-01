package com.example.exampleapp.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.exampleapp.model.Message;
import com.example.exampleapp.repository.MessageRepository;

import io.awspring.cloud.sqs.annotation.SqsListener;

@Component
public class MessageListener {

    @Autowired
    private MessageRepository messageRepository;

    // Nasłuch na kolejce przetworzonych wiadomości
    @SqsListener("${sqs.processedMessagesQueueUrl}")
    public void receiveProcessedMessage(Message message) {
        messageRepository.save(message);
        System.out.println("Received processed message: " + message);
    }
}