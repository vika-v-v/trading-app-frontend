import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpclientProviderService } from './httpclient-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Hier werden die Anfragen an den Server geschickt und der Token global gespeichert

  private rootUrl: string;
  private token: string = '';

  constructor(@Inject('ROOT_URL') rootUrl: string, private httpProvider: HttpclientProviderService) {
    this.rootUrl = rootUrl;
  }

  //Bearer-Token für spätere API-Calls wird festgehalten
  setToken(token: string) {
    this.token = token;
  }

  getToken(){
    return this.token;
  }

  // mocked
  login(email: string, password: string): Observable<any> {
    const loginUrl = this.rootUrl + 'users/login';

    const httpOptions = {
      headers: new HttpHeaders({
        'X_API_KEY': 'SP01Key'
      })
    };

    const formData = new FormData();
    formData.append('email', email);
    formData.append('passwort', password);

    return this.httpProvider.getHttpClient().post(loginUrl, formData, httpOptions);
  }

  //API-Call für das Registrieren
  // mocked
  register(email: string, passwort: string): Observable<any> {
    const registerUrl = this.rootUrl + 'users/register';

    const httpOptions = {
      headers: new HttpHeaders({
        'X_API_KEY': 'SP01Key'
      })
    };

    const formData = new FormData();
    formData.append('email', email);
    formData.append('passwort', passwort);

    return this.httpProvider.getHttpClient().post(registerUrl, formData, httpOptions);
  }

  //API-Call für das Passwort zurücksetzen
  // mocked
  resetPassword(email: string): Observable<any> {
    const resetUrl: string = this.rootUrl + 'users/reset-passwort-initialisieren';

    const httpOptions = {
        headers: new HttpHeaders({
          'X_API_KEY': 'SP01Key'
        }),
    };

    const formData = new FormData();
    formData.append('email', email);

    return this.httpProvider.getHttpClient().post(resetUrl, formData, httpOptions);
  }

  updateUserData(optionalData:
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

    return this.httpProvider.getHttpClient().patch(resetUrl, formData, httpOptions);
  }

  //API-Call um User-Daten zu bekommen
  getUserData(): Observable<any>{
    const userUrl = `${this.rootUrl}users/me`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(userUrl, httpOptions);
  }

  deleteUser(): Observable<any>{
    const userUrl = `${this.rootUrl}users/delete`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    this.setToken('');
    return this.httpProvider.getHttpClient().delete(userUrl, httpOptions);
  }

  getAccountValue(): Observable<any>{
    const accountValueURL = `${this.rootUrl}users/account-values`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(accountValueURL, httpOptions);
  }

  getDepots(): Observable<any>{
    const getAllDepotsURL = `${this.rootUrl}depot/getAllDepots`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(getAllDepotsURL, httpOptions);
  }
}
