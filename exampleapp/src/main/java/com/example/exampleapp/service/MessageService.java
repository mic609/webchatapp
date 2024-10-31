package com.example.exampleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.exampleapp.model.Message;
import com.example.exampleapp.model.User;
import com.example.exampleapp.repository.MessageRepository;
import com.example.exampleapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private MessageRepository messageRepository;
    private UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository){
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getMessagesBetweenUsers(String usernameSender, String usernameReceiver) {
        User userSender = userRepository.findByUsername(usernameSender)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + usernameSender));
        User userReceiver = userRepository.findByUsername(usernameReceiver)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + usernameReceiver));
    
        return messageRepository.findBySenderAndReceiverOrReceiverAndSender(userSender, userReceiver);
    }

    public Message sendMessage(Message message) {
        User sender = userRepository.findByUsername(message.getSender().getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findByUsername(message.getReceiver().getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
    
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }
}
