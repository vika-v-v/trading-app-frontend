import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootUrl = "http://213.133.101.113:8080/api/";

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
