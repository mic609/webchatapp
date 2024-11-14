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
        accessKeyId: 'ASIA5N6XPWXWSEULHXXU',
        secretAccessKey: '9HeHULLNBvZ6TuAvqDW4NEJLcBVb+cvR76tcu6Ge',
        sessionToken: 'IQoJb3JpZ2luX2VjEGoaCXVzLXdlc3QtMiJIMEYCIQC4NTTaDPerv3OWnupAxDaPsDUfaKmjUHga5ImyVlx4QAIhAPAkfyrqoHJFROQ5FSXpTnoQ4zimdZA2fsxb4ablVR9LKrICCPP//////////wEQARoMOTIzMzMzMDE1MDIxIgyOjlkWweHkvJaonowqhgJxloCLEZW/XdRgo5wpMOaTPrS68d2QOwiVIj7kDWHElHKYRxj/xW8yx9RClmSEyo8T/jgDB2VKarpWgolF+Yv2hmOqntUJtrqIP31weCz1jqdKeBYlb85/g8FVVFikzCk4xZ/3rFWdNWg41D2/xbdBarQyctM1PiCiS7OF0w0BKdvx7DAbeQBhtwO7gzF7Eo/hOWa10lp3Q4UsylhJ+v3UiMWx0Z6+J/BQqfA2fJKb8BcRlg3v0wXpkR0cSAkC6UlWr8YrAAv1cgmtnf87dS4gD9uJiMIqKG7YKPko/qHvFABwtiZOGCcoArdZ5nx8YNSKJrOvPvOuNSazlctY69F3fPcz6W3RMN3o2LkGOpwBoHP2DPP8Ee/GvBSgLJ6XQEH65G3mIm2/HwnR+uaD6wExlO98YFKrlyI+vTnChTcyNWqJnsn+rix/wrZIuijjBHMxIIYkZPiblTQttsUwj3gPm2h6QKYy1Z6Op2l/HmjDI+toZPDzoM9dUHvKfsdDGfNOFI3mnG/ktrHkGdiy97Wp3qiQrxjtWkHVRDGoBO91l0AzGKTEqux1V+g3'
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