package com.example.exampleapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.exampleapp.model.User;
import com.example.exampleapp.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all-except-current")
    public List<User> getAllUsersExceptCurrent() {
        return userService.findAllExceptCurrentUser();
    }

    @GetMapping("/current")
    public User getLoggedInUser() {
        return userService.findLoggedInUser();
    }
}