import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient, private router: Router) { }

  createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  register(username: string, password: string): Observable<any> {
    const user = { username, password };
    return this.http.post(this.apiUrl, user);
  }

  logout() {
    const headers = this.createHeaders();
    return this.http.post('http://localhost:8080/api/auth/logout', {headers}).pipe(
      catchError(error => {
        console.error('Błąd wylogowania z backendu:', error);
        return [];
      }),
      map(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    );
  }
}