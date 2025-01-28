package com.example.exampleapp.controller;

import com.example.exampleapp.dto.MessageDto;
import com.example.exampleapp.model.Message;
import com.example.exampleapp.service.MessageService;
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
    public MessageDto sendWebSocketMessage(@RequestBody MessageDto messageDto) {
        return messageService.sendMessage(messageDto);
    }
}
