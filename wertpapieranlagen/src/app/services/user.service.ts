import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootUrl: string;
  private token: string = '';

  constructor(@Inject('ROOT_URL') rootUrl: string) {
    this.rootUrl = rootUrl;
  }

  setToken(token: string) {
    this.token = token;
  }
  getToken(){
    return this.token;
  }

  login(http: HttpClient, email: string, passwort: string): Observable<any> {
    const loginUrl = this.rootUrl + 'users/login';

    const httpOptions = {
      headers: new HttpHeaders({
        'X_API_KEY': 'SP01Key'
      })
    };

    const formData = new FormData();
    formData.append('email', email);
    formData.append('passwort', passwort);

    return http.post(loginUrl, formData, httpOptions);
  }

  register(http: HttpClient, email: string, passwort: string): Observable<any> {
    const registerUrl = this.rootUrl + 'users/register';

    const httpOptions = {
      headers: new HttpHeaders({
        'X_API_KEY': 'SP01Key'
      })
    };

    const formData = new FormData();
    formData.append('email', email);
    formData.append('passwort', passwort);

    return http.post(registerUrl, formData, httpOptions);
  }

  resetPassword(http: HttpClient, email: string): Observable<any> {
    const resetUrl: string = this.rootUrl + 'users/reset-passwort-initialisieren';

    const httpOptions = {
        headers: new HttpHeaders({
          'X_API_KEY': 'SP01Key'
        }),
    };

    const formData = new FormData();
    formData.append('email', email);

    return http.post(resetUrl, formData, httpOptions);
  }

  updateUserData(http: HttpClient, optionalData:
    {
      email?: string;
      password?: string;
      vorname?: string;
      nachname?: string;
      telefonnummer?: string;
      strasse?: string;
      hausnummer?: string;
      plz?: string;
      ort?: string;
      steuersatz?: string;
      freibetrag?: string;
      kirchensteuer?: string;
      verlustverrechnungstopf?: string;
    }): Observable<any> {

  const resetUrl: string = this.rootUrl + 'users/update';
  const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      }),
    };

    const formData = new FormData();

    Object.keys(optionalData).forEach(key => {
      const value = optionalData[key as keyof typeof optionalData];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return http.patch(resetUrl, formData, httpOptions);
  }

  getUserData(http: HttpClient): Observable<any>{
    const userUrl = `${this.rootUrl}users/me`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return http.get(userUrl, httpOptions);
  }

  getAccountValue(http: HttpClient): Observable<any>{
    const accountValueURL = `${this.rootUrl}users/account-values`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return http.get(accountValueURL, httpOptions);
  }

}
