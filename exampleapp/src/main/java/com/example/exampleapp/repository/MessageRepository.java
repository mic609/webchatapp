package com.example.exampleapp.repository;

import com.example.exampleapp.model.Message;
import com.example.exampleapp.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    // List<Message> findBySenderAndReceiverOrReceiverAndSender(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT m FROM Message m WHERE (" +
           "(m.sender.username = :username1 AND m.receiver.username = :username2) OR " +
           "(m.sender.username = :username2 AND m.receiver.username = :username1)) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findBySenderUsernameAndReceiverUsername(
        @Param("username1") String username1, 
        @Param("username2") String username2
    );
}