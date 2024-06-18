import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import für HttpHeaders hinzugefügt
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DepotService {

  private rootUrl: string;

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService) {
    this.rootUrl = rootUrl;
  }

  depotErstellen(http: HttpClient, name: string, waehrung: string): Observable<any> {
    const createDepotUrl = this.rootUrl + 'depot/create';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    const formData = new FormData();
    formData.append('name', name);
    formData.append('waehrung', waehrung);

    return http.post(createDepotUrl, formData, httpOptions);
  }

  getWertverlauf(http: HttpClient, depotName: string): Observable<any>{
    const getDepotWertverlaufUrl = `${this.rootUrl}depot/getWertpapierDepotHistorie?depotName=` + depotName;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    return http.get(getDepotWertverlaufUrl, httpOptions);
  }

  getWertpapiere(http: HttpClient, depotName: string): Observable<any> {
    const getWertpapiereURL= `${this.rootUrl}depot/getWertpapiere?depotName=` + depotName;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(getWertpapiereURL, httpOptions);
  }

  getTransaktionen(http: HttpClient, depotName: string): Observable<any> {
    const url = `${this.rootUrl}depot/getTransactions?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(url, httpOptions);
  }

  getDepot(http: HttpClient, depotName: string): Observable<any>{
    const getDepotUrl = `${this.rootUrl}depot/getDepot?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(getDepotUrl, httpOptions);
  }
}
