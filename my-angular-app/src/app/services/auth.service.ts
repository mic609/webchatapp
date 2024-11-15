import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { catchError, map, Observable, of } from 'rxjs';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { AppConfigService } from './app.config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `http://${environment.apiUrl}/api/auth/register`;
  userPool: any;
  cognitoUser: any;
  username: string = "";
  cognito: any;

  constructor(private http: HttpClient, private router: Router, private appConfigService: AppConfigService) {
    this.cognito = {
      production: false,
      cognitoUserPoolId: this.appConfigService.cognitoUserPoolId,
      cognitoAppClientId: this.appConfigService.cognitoAppClientId
    };
  }

  createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  register(username: string, password: string): Observable<any> {
    let poolData = {
      UserPoolId: this.cognito.cognitoUserPoolId,
      ClientId: this.cognito.cognitoAppClientId,
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

  login(username: any, password: any) {
    let authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    let poolData = {
      UserPoolId: this.cognito.cognitoUserPoolId,
      ClientId: this.cognito.cognitoAppClientId,
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
        accessKeyId: 'ASIA5N6XPWXWRW3QW2G5',
        secretAccessKey: 'JNkyjojl6/cFZoga4NVFdNZX7wBnjT9jxG61c9H2',
        sessionToken: 'IQoJb3JpZ2luX2VjEH0aCXVzLXdlc3QtMiJHMEUCIFnVR+y6MExMtMXj2gKWAd8nPfEu61U3z+F/OQftHaZ5AiEAztIafynXNxq3jXRHfBOpTJbfLqSYqoKE/+novhxDmOQqqQIIFhABGgw5MjMzMzMwMTUwMjEiDC36p5oRqJs5yBN2PSqGAvQooazUpu9Q3ltKzrg3zC9mCizQzIrXt+hai9kPGk8IUpga8xS16nzb4Sy9DPN+3fO5TD9Yl7tnhlao4UtOngczGyzD8jMqKXY2se5zjR5cxfQ/Zi2m6/BSgiA4wTa8y8rGRbtT5jWO7inZ2xmVnetK+wTrvchkYFcdB9wLDcNA48UWSIHE04YGjUpixVotcaDrtzeMPBv36T51MQsSdtrwUvjNmRhD0N7T9EjQYhO1Ezic314HgkMvr0vcBxpTdg/Mz5+kY5JbRpPBworvD786o3X1HGhCsdPTxA74GkMdZC6OFQUjVXYxKv3U8dUuXgaWzgkvoh9w1ylTnX4nW5cFKM5cmUkwhIHduQY6nQHhhOG1ZKys79nCgzP93BslYj9HjOjlIbj9tCwuIhOVo3QErtKuLrl+TB/5hdF/MMZI3yfcIJntkCSgpCC896/9geA6I7PFMxUbCddOkmF6hkmuTsRXO4/GEi6lMSFDPtCus14sUDYIeFmWLZy8xzzkcu+ooDeI2M44yhSg6YSe4HkCxyUyY0rGKKPWjz99+NjB5GrsyP4PvI1rHH8E'
      }
    });

    let poolData = {
      UserPoolId: this.cognito.cognitoUserPoolId,
      ClientId: this.cognito.cognitoAppClientId,
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

  // Logout 
  logOut() {
    let poolData = {
      UserPoolId: this.cognito.cognitoUserPoolId,
      ClientId: this.cognito.cognitoAppClientId,
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