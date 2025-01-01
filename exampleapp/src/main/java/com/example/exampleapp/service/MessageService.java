package com.example.exampleapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.exampleapp.model.Message;
import com.example.exampleapp.model.User;
import com.example.exampleapp.repository.MessageRepository;
import com.example.exampleapp.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;

import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.awspring.cloud.sqs.operations.SqsTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Value("${sqs.pendingMessagesQueueUrl}")
    private String pendingMessagesQueueUrl;

    // private final SqsClient sqsClient;
    // private final ObjectMapper objectMapper;

    @Autowired
    private SqsTemplate sqsTemplate;

    private MessageRepository messageRepository;
    private UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, SqsClient sqsClient, ObjectMapper objectMapper){
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        // this.sqsClient = sqsClient;
        // this.objectMapper = objectMapper;
    }

    public List<Message> getMessagesBetweenUsers(String usernameSender, String usernameReceiver) {
        User userSender = userRepository.findByUsername(usernameSender)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + usernameSender));
        User userReceiver = userRepository.findByUsername(usernameReceiver)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + usernameReceiver));
    
        return messageRepository.findBySenderUsernameAndReceiverUsername(userSender.getUsername(), userReceiver.getUsername());
    }

    public Message sendMessage(Message message) {
        User sender = userRepository.findByUsername(message.getSender().getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findByUsername(message.getReceiver().getUsername())
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
    
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setTimestamp(LocalDateTime.now());

        // sendToSqs(message);
        sqsTemplate.send(pendingMessagesQueueUrl, message);

        return message;
    }

    // private void sendToSqs(Message message){
    //     try {
    //         String messageJson = objectMapper.writeValueAsString(message);

    //         SendMessageRequest request = SendMessageRequest.builder()
    //                 .queueUrl(queueUrl)
    //                 .messageBody(messageJson)
    //                 .messageGroupId("webchatapp-messages-group")
    //                 .delaySeconds(0)
    //                 .build();

    //         sqsClient.sendMessage(request);
    //         System.out.println("Message sent to SQS: " + messageJson);
    //     } catch (JsonProcessingException e) {
    //         throw new RuntimeException("Failed to serialize message to JSON", e);
    //     }
    // }
}
