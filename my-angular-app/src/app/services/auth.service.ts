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
        accessKeyId: 'ASIA5N6XPWXW7L4BL66L',
        secretAccessKey: 'IK5W4011TwbSNHBtHvXp0dVyfSr8ueNa8R22DmIa',
        sessionToken: 'IQoJb3JpZ2luX2VjEGUaCXVzLXdlc3QtMiJIMEYCIQDtMfp245MxQ8aZe0kSe7CoYQWGTC2sEo6aNnpFJFCoiwIhAIjomaAi61Wkrxmov8B1aj6R/IqlqGQHoX7xZ4U5YB1gKrICCO7//////////wEQARoMOTIzMzMzMDE1MDIxIgwXD6VJ3j8pBUpurs4qhgIso/4OH274+CAby8pr9lblYV2GajNuTPUePqTIKV/EM/M5IhUBl8B1moEPpxDvU63TARYZhdYag+VwKm6qpti/s+hlk+t17PtFYeA6ct2OxfCBfLFAfcDwEmcD3/dPZrV13e2MkhwT9Z0I376RU9kA/oXMXv3Dy8mQUyjvGM2bjttgNJIUbOjaQkv2qpXPzisiLG34+iivZdpAYe3+n3W6bUMXIj7fErIZLIdo2aj6fcYukiPnFup5hEemJvuzz+H3pelkVrifOedrLx/r5TCUd0GvD/TGEoTS1Z+CGhJ5c42k2w5yIHsond8Y4enlWY3G+oHMaKCeMcb80MO4nMnd2C2Rhja8MKfs17kGOpwBsuGLgL/5NFYkQn600Tnee0PLF5yjihH7vmvTSg0WD2K1LXEA1VcJEfcrEYGvzkExIdyJxgB2u1lK7EJRlE8ABLXa91euAhUG/BtMVNgratV+TebG/VKxI0YfmvXr3dg+Hd1uyg93ceo/ReaIfQreki5eqriH4rFswa7hlviiHqECHJ7WSqI8mHGWY8vMCwdIow0xptn6bfomhjAX'
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