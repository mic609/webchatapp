// src/app/home/home.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/User';
import { EMPTY_USER } from '../models/EmptyUser';
import { Message } from '../models/Message';
import { catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  loggedInUser: User = EMPTY_USER;
  // private messagesSubscription!: Subscription;

  constructor(private userService: UserService, private messageService: MessageService, private authService: AuthService) {
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

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.loggedInUser = EMPTY_USER
        console.log('Użytkownik został wylogowany');
      },
      error: (error) => {
        console.error('Błąd przy wylogowywaniu:', error);
      },
    });
  }
}