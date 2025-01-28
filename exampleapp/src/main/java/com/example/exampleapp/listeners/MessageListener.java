package com.example.exampleapp.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.exampleapp.dto.MessageDto;
import com.example.exampleapp.model.Message;
import com.example.exampleapp.model.User;
import com.example.exampleapp.repository.MessageRepository;
import com.example.exampleapp.repository.UserRepository;

import io.awspring.cloud.sqs.annotation.SqsListener;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor(onConstructor_ = @Autowired, access = AccessLevel.PROTECTED)
public class MessageListener {
    private MessageRepository messageRepository;
    private UserRepository userRepository;

    // Nasłuch na kolejce przetworzonych wiadomości
    @SqsListener("${sqs.processedMessagesQueueUrl}")
    public void receiveProcessedMessage(MessageDto messageDto) {
        Message message = new Message();
        message.setContent(messageDto.getContent());
        message.setTimestamp(messageDto.getTimestamp());

        User sender = userRepository.findByUsername(messageDto.getSender())
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findByUsername(messageDto.getReceiver())
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        message.setSender(sender);
        message.setReceiver(receiver);

        messageRepository.save(message);
        System.out.println("Received processed message: " + message);
    }
}