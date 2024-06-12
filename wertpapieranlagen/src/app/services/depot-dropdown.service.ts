import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import für HttpHeaders hinzugefügt
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DepotDropdownService {
  private rootUrl: string;
  private depot: string = '';
  private reloadSubject = new BehaviorSubject<void>(undefined); 

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService) {
    this.rootUrl = rootUrl;
  }

  setDepot(depot: string) {
    this.depot = depot;
  }
  getDepot(){
    return this.depot;
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

  reloadDepots() {
    this.reloadSubject.next(); // Hinzugefügt
  }

  getReloadObservable(): Observable<void> {
    return this.reloadSubject.asObservable(); // Hinzugefügt
  }
  
}
