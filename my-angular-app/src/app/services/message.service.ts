import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, scan, Subject } from 'rxjs';
import { Message } from '../models/Message'
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://127.0.0.1:8080/api/messages';

  constructor(private http: HttpClient) {}

  createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Dodaj token JWT do nagłówka
    });
  }

  sendMessage(message: Message): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(this.apiUrl, message, {headers});
  }

  getMessages(usernameSender: string, usernameReceiver): Observable<any>{
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}/${usernameSender}/${usernameReceiver}`, {headers});
  }
}
