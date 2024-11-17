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
        accessKeyId: 'ASIA5N6XPWXWRLBCAFGZ',
        secretAccessKey: 'rYVVgd6M6l2GBi8E0mOabbTP5S3LJtGijxN1Lf+d',
        sessionToken: 'IQoJb3JpZ2luX2VjELD//////////wEaCXVzLXdlc3QtMiJHMEUCIG6DbgF5pjPTQ+p6c+nLXLr9vl47Owl7aM4klgZqYYorAiEA4HwcBEzGvKS+MtLoxOPzEROxIe8O0SlIl5yiOT+wMhEqqQIISRABGgw5MjMzMzMwMTUwMjEiDCa68adMwa+YbDJj0iqGAvnxFehlRSqUMdgCQZbgJAUj37BKbEwHXYw95jzQrLdO2EPb5L4JGkKP+OmZa10nlt7R/SCF9D0JciqKWpkkEzTV+Jnbu9Y40LDLkgztDDfL5tXIfpnlM5cOLpYayK+sR7J5+f+bxM2hj7iBMHGlMCuBDEdtGP8QLt/MIowi0bAwUGq6Ncgkd3arGJQ+or0XUqBAc1v0gTWkqIeBAKcVaIFYobH1Fd8WwpZASeZaXeWOuvzlfslFHmUQWUAKJmVRIPwkW8yy6ltMv4iv8U72Rakd0TmU7+vP3XbA0CbVeZtwVSE5gLDYvVpDEuq+6p/1TnfM4N2WuA9ox1U5nTcSKEx+Dnu5f2ow4ZrouQY6nQFIg6gK8HK19fhnPrsoQoRCLGw9bKO2j4h4DO8cXRToTCB/N5oPDQndop2Yi+DNQzH54zMuBPmXJNbXZaTYaszmtZAh5PrzN4wV+yIE/yV0iIIV//a26DfOlXXC4+21zjSobClHHYjjTF/ImSTLKAHhOQ7cbuYMIE5X7Ks65/ooiSGOe9rNHeHVANYTPQxrYZ0XQcJUswB2C65iCCCH'
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