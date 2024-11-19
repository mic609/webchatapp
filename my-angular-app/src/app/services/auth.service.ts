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
        accessKeyId: 'ASIA5N6XPWXWVF4U3SBJ',
        secretAccessKey: 'rBQoZel+95ZFbSP10tv9zpbwsPsKc/WzJ47CcuUz',
        sessionToken: 'IQoJb3JpZ2luX2VjENv//////////wEaCXVzLXdlc3QtMiJHMEUCIEIOKY4mHmb2lqDOTecctXFbFmLs2yeDAFf6mbEUh6gFAiEAkMX9Ksor9YMskiKMGC23LA3WAQtpQ6seP73qseAqMrcqqQIIdBABGgw5MjMzMzMwMTUwMjEiDIG0dZdGoRkj55WvVCqGAvNdXXLeNZjGVraFnt+NSkHS625SmuHsdW9/sP2OX/I4lmvszSwTgFBgaLt9hi70edUfWDKZwCeP9H4PcZnIooAGTQf4aJxb8gX2JSV0Ab9SRicmX6ERf7E1RWfydwis2Mt6toIPQcHM8bRSwUNQUlm/AJpmD8xSOb7gd7AUARLGn1jrh8moi77PF+6g1+r9ZXtVZEno/QWF2qvLv+w2jqE22keTHAbDJmagTNv4UJ776qmkwOt71/0Y51QoDRQ2L54YgH3T+tan4gmiDKzzgF710t3MpDoyoDNKDiPLVU3stlk57wbk0nP2cihym2dh5/uzJvstYcWOaIFW3pJ52bsF4NcVVS4w9NXxuQY6nQGZA56RBDosPezT9DRdStLaXhSGia/L9iJFvDOIUJmasV/jfjXgsHnuh9iRrclHg5iJ1HaWfEkOtQsS38IWTI6JKVLwK9LmWJX5xEff92SR5crODUnaMbUCxjI779uEt+sTVscEeAin6bMQzHT32lHJ1P16bb1WNK7dkv8STpadQza04MzNE8LY92gDuFlZd3sPrQQ87RB0vwY0S9xh'
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