import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import für HttpHeaders hinzugefügt
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DepotDropdownService {
  
  private rootUrl: string;
  private token: string = '';

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService) {
    this.rootUrl = rootUrl;
  }

  setToken(token: string) {
    this.token = token;
  }
  getToken(){
    return this.token;
  }

  getAllDepots(http: HttpClient): Observable<any> {
    const createDepotUrl = this.rootUrl + 'depot/getAllDepots';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(createDepotUrl, httpOptions);
  }
}
