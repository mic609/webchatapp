// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `http://${environment.apiUrl}/api/users`; // Zmień na odpowiedni adres API

  constructor(private http: HttpClient) {}

  // Funkcja do ustawiania nagłówków z tokenem
  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  // Przykładowa metoda pobierania użytkowników
  getUsers(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}/all-except-current`, { headers });
  }

  getLoggedInUser(): Observable<any>{
    const headers = this.createHeaders();
    return this.http.get(`${this.apiUrl}/current`, { headers });
  }
}