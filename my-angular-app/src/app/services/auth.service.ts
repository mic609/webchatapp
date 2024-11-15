import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { catchError, map, Observable, of } from 'rxjs';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { cognito } from '../models/Cognito';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `http://${environment.apiUrl}/api/auth/register`;
  userPool: any;
  cognitoUser: any;
  username: string = "";

  constructor(private http: HttpClient, private router: Router) {
  }

  createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // register(username: string, password: string): Observable<any> {
  //   const user = { username, password };
  //   return this.http.post(this.apiUrl, user);
  // }

  register(username: string, password: string): Observable<any> {
    let poolData = {
      UserPoolId: cognito.cognitoUserPoolId,
      ClientId: cognito.cognitoAppClientId,
    };

    this.userPool = new CognitoUserPool(poolData);
    
    return new Observable((observer) => {
      this.userPool.signUp(username, password, [], null, (err: any, data: any) => {
        if (err) {
          console.log("Błąd rejestracji w Cognito:", err);
          observer.error(err);
        } else {
          console.log("Użytkownik zarejestrowany w Cognito:", data);

          this.http.post(this.apiUrl, { username, password }).pipe(
            map(response => {
              console.log("Użytkownik zarejestrowany w bazie danych");
              observer.next(response);
            }),
            catchError(error => {
              console.error('Błąd przy dodawaniu użytkownika do bazy danych', error);
              return of(null);
            })
          ).subscribe();

          this.confirmRegistration(username).then(() => {
            observer.next(data);
          }).catch((error) => {
            observer.error(error);
          });
        }
      });
    });
  }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ZizQHVoRj', {
  //     AuthParameters: {
  //       USERNAME: username,
  //       PASSWORD: password
  //     },
  //     AuthFlow: 'USER_PASSWORD_AUTH',
  //     ClientId: 'YOUR_COGNITO_CLIENT_ID'
  //   }).pipe(
  //     map((response: any) => {
  //       const token = response.AuthenticationResult.IdToken;
  //       localStorage.setItem('token', token);
  //       this.router.navigate(['/home']);
  //     }),
  //     catchError(error => {
  //       console.error('Błąd logowania z Cognito:', error);
  //       throw error;
  //     })
  //   );
  // }

  login(username: any, password: any) {
    let authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let poolData = {
      UserPoolId: cognito.cognitoUserPoolId,
      ClientId: cognito.cognitoAppClientId,
    };

    this.username = username;
    this.userPool = new CognitoUserPool(poolData);
    let userData = { Username: this.username, Pool: this.userPool };
    this.cognitoUser = new CognitoUser(userData);

    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        const jwtToken = result.getIdToken().getJwtToken();
        localStorage.setItem('token', jwtToken);
        this.router.navigate(["/home"]);
        console.log("Wyniki : ", result);
      },
      newPasswordRequired: () => {
        this.router.navigate(["/newPasswordRequire"]);
      },
      onFailure: (error: any) => {
        console.log("error", error);
      },
    });
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword === confirmPassword) {
      this.cognitoUser.completeNewPasswordChallenge(
        newPassword,
        {},
        {
          onSuccess: () => {
            console.log("Pomyślnie zresetowano hasło");
            this.router.navigate(["/login"]);
          },
          onFailure: () => {
            console.log("Błąd przy resetowaniu hasła");
          },
        }
      );
    } else {
      console.log("Hasło nie jest takie samo");
    }
  }

  // Automatyczne potwierdzenie użytkownika
  confirmRegistration(username: string): Promise<any> {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'ASIA5N6XPWXWZ3T7UVXG',
        secretAccessKey: 'fMFTgW0gaP0NOjxbqa+rhH00K9mKnWd850vB0cS0',
        sessionToken: 'IQoJb3JpZ2luX2VjEG4aCXVzLXdlc3QtMiJHMEUCIDv/1hSvOP4/Icgwrw+q39xR2umZkcAN1KGU6ASUYjiIAiEA7GKeHCxopqpUoMYSdPHVh+JVlOZdx/8lrfvYKPgyDHwqsgII9///////////ARABGgw5MjMzMzMwMTUwMjEiDL8GfT80CJ+XWSjfaCqGAgboTRUxqC87+K9OotP1bnmWGq6PnCCHM4DKFiNdKM0N6cl4gCnHcBPkwMLP5bgfE8Tg/EWcOdY8PxseLQRMlXj8cBN8ZoLXps5mUK8qzWqh1bHHpGCahjWtK+YWfar8XxZEkGv+RrSnalGwthSsr+YvVUNGShDPswLljzePJfLlBWrHXIkag07A3y0TdHdi2W5THrZf2tc1fZRCAAiNVtb9ZzVs85E05IuZJOB6xqRxHJQJVObJSnHZWisYl8aZvOnZl7aROwdejZkDLN92DeJzvvAia0nnTEGuLqJ7Qte5fLZla4Cp8I7O+sVzg590aQjTBweN+uXvgWdoazoPNQ3MDOK/KXcwvN3ZuQY6nQHxuM6Y45i0XLDItFjSxpG4b6m5u+TjteSZs3uKY7gE0+lPvg5sPod3PrtiStiYvALY+N78F3jM9XFgEK9pXfzP9qy5uJBg5qMhZ6yn3Wv0iI/bE4iK+ed3k2hxb9GnxQA8TcLezF0XKsbsfy5Wq1MZ51ePyl1uXylULL1GHWFJju+reEwU4FAHx5M8iVwp6G+ui/JvIDvpn0KO4HFf'
      }
    });

    let poolData = {
      UserPoolId: cognito.cognitoUserPoolId,
      ClientId: cognito.cognitoAppClientId,
    };

    const params = {
      UserPoolId: poolData.UserPoolId,
      Username: username,
    };

    return new Promise((resolve, reject) => {
      cognitoIdentityServiceProvider.adminConfirmSignUp(params, (err, data) => {
        if (err) {
          console.error('Błąd podczas potwierdzania użytkownika:', err);
          reject(err);
        } else {
          resolve(data);
          this.router.navigate(["login"]);
        }
      });
    });
  }


  // logout() {
  //   const headers = this.createHeaders();
  //   return this.http.post('http://localhost:8080/api/auth/logout', {headers}).pipe(
  //     catchError(error => {
  //       console.error('Błąd wylogowania z backendu:', error);
  //       return [];
  //     }),
  //     map(() => {
  //       localStorage.removeItem('token');
  //       this.router.navigate(['/login']);
  //     })
  //   );
  // }

  // Logout 
  logOut() {
    let poolData = {
      UserPoolId: cognito.cognitoUserPoolId,
      ClientId: cognito.cognitoAppClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser) {
      localStorage.removeItem('token')
      this.cognitoUser.signOut();
      this.router.navigate(["login"]);
    }
  }
}