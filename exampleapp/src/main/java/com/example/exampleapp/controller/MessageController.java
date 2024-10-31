package com.example.exampleapp.controller;

import com.example.exampleapp.model.Message;
import com.example.exampleapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @GetMapping("/{usernameSender}/{usernameReceiver}")
    public List<Message> getMessages(@PathVariable String usernameSender, @PathVariable String usernameReceiver) {
        return messageService.getMessagesBetweenUsers(usernameSender, usernameReceiver);
    }

    @PostMapping
    public Message sendWebSocketMessage(@RequestBody Message message) {
        return messageService.sendMessage(message); // Zachowuje logikę z sendMessage
    }
}
