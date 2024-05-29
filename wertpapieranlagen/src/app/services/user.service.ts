import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootUrl: string;

  private token!: string;

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

  reset(http: HttpClient, email: string): Observable<any> {
    const resetUrl: string = this.rootUrl + 'users/reset-passwort';

    const httpOptions = {
        headers: new HttpHeaders({
          'X_API_KEY': 'SP01Key'
        }),
        params: new HttpParams().set('email', email)
    };

    return http.get(resetUrl, httpOptions);
}

  updateUserData(http: HttpClient, userId: string, optionalData: 
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
        'X_API_KEY': 'SP01Key'
      }),
  };

  const formData = new FormData();

  Object.keys(optionalData).forEach(key => {
    const value = optionalData[key as keyof typeof optionalData];
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return http.post(resetUrl, formData, httpOptions);
}

}
