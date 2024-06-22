import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { UpdateEverythingService } from './update-everything.service';

@Injectable({
  providedIn: 'root'
})
export class DepotDropdownService {
  private rootUrl: string;
  private depot: string = '';
  private reloadSubject = new BehaviorSubject<void>(undefined);

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService, private updateEverythingService: UpdateEverythingService) {
    this.rootUrl = rootUrl;
  }

  setDepot(depot: string) {
    if(depot != this.depot) {
      this.updateEverythingService.updateAll();
    }
    this.depot = depot;

    //this.updateEverythingService.updateAll();
    //this.reloadDepots(); // Notify subscribers of the change
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
    this.reloadSubject.next();
  }

  getReloadObservable(): Observable<void> {
    return this.reloadSubject.asObservable();
  }
}
