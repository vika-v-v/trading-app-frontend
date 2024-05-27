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
}
