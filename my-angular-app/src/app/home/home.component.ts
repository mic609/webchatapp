// src/app/home/home.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/User';
import { Message } from '../models/Message';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  users: User[] = [];
  selectedUser!: User;
  messages: Message[] = [];
  messageContent: string = '';
  loggedInUser!: User;
  // private messagesSubscription!: Subscription;

  constructor(private userService: UserService, private messageService: MessageService) {
    this.loadUsers();
    this.loadLoggedInUser();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  loadLoggedInUser() {
    this.userService.getLoggedInUser().subscribe((data: User) => {
      this.loggedInUser = data;
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.loggedInUser.username, this.selectedUser.username).subscribe((data: Message[]) => {
      this.messages = data;
    });
  }

  sendMessage() {
    if (this.selectedUser && this.messageContent) {
      const message = {
        content: this.messageContent,
        timestamp: new Date(),
        sender: this.loggedInUser,
        receiver: this.selectedUser
      } as Message;
      this.messageService.sendMessage(message).subscribe(() => {
        this.messageContent = '';
        this.loadMessages();
      });
    }
  }
}