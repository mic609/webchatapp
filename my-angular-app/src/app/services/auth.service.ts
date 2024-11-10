import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../models/Environment';
import * as CryptoJS from 'crypto-js';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth/register';
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
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
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
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
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
        accessKeyId: 'ASIA5N6XPWXWQW2INUWD',
        secretAccessKey: '/y6Z98IgyROEQzo4pZ7qbsMsEbjj04pAXh88emzI',
        sessionToken: 'IQoJb3JpZ2luX2VjEBAaCXVzLXdlc3QtMiJHMEUCIEwbYOiIK29KAEPj/vWiCuBIphp8SnZRmkU+A1f0kPj/AiEAoS23vRIbxLpTUZINIctSfGWCtTqqcSQFQqUavzmkpMsqsgIImf//////////ARABGgw5MjMzMzMwMTUwMjEiDIvoeWHfFJylu134+SqGAoadjTpzuP9pE29TF5lwEkRgnqQS1F6AM7TWS4p4SlG1feyUzR3ud65s18MpNyJJoLPX2LYPQMSJZkOol1hvXqooivdWKm1ELbEB3agCXM3ofvv/8HT4eOmCv9XinkjptDPRr/h8FG1ivCXf12scZdWtr1Ae2TTDnkadurlZeuYlWB9A8gviRgmwxDZFoifKIJng8oCmEAbw/LTRxe98uWR2vM94f6oelAou3rNZHTqF/C/237LQ2BHrpYTBn8Jw/lKAHd2DG0Uip9YrgockYupGYP5nqJ7p8zC2RHoTogFpmoCKKq9XvuvWyWY1BnJYdC0jWxSIEUPMjQn4BQlD5gnxPIg257MwhYnFuQY6nQHrtE+Rx285PXkkegEEEvIjv87S9sBdhtZ6/Wh8oUhrAch6S/+cisWwnKWZqs8vcFIUwm7obCwlQ78Hg6cto7eLdyba4NjWDZNt/XKSaSg76fJeIh4vEzynGCtSgejGQq0EOKW39ADlwZP2BRcjOkxpWFePouaHrMN+Nto8DfqKiHU/59lmkqRtiNjWdILxYxAbWYfg/NEd6Hj+7kYG'
      }
    });

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
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
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    this.userPool = new CognitoUserPool(poolData);
    this.cognitoUser = this.userPool.getCurrentUser();
    if (this.cognitoUser) {
      localStorage.removeItem('token')
      this.cognitoUser.signOut();
      this.router.navigate(["login"]);
    }
  }

  getSecretHash(username: string, clientId: string, clientSecret: string): string {
    const message = username + clientId;
    const secretHash = CryptoJS.HmacSHA256(message, clientSecret);
    console.log("HMAC SHA-256:", secretHash.toString(CryptoJS.enc.Base64));
    return secretHash.toString(CryptoJS.enc.Base64);
  }

}