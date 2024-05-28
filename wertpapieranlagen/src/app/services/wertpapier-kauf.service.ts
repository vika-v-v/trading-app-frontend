import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from "@angular/common/http";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WertpapierKaufService {
  private rootUrl: string;

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService) {
    this.rootUrl = rootUrl;
  }

  wertpapierkaufErfassen(http: HttpClient, depotName: string, date: string, wertpapiername: string, anzahl: string, wertpapierPreis: string, transaktionskosten: string): Observable<any>{
    const url = this.rootUrl + "depot/addTransaction";

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization":`Bearer ${this.userService.getToken()}`,
      })
    };

    const formData = new FormData();

    formData.append("depotName",depotName);
    formData.append("date",date);
    formData.append("wertpapiername",wertpapiername);
    formData.append("anzahl",anzahl);
    formData.append("wertpapierPreis",wertpapierPreis);
    formData.append("transaktionskosten",transaktionskosten);
    formData.append("transaktionsart", "KAUF");

    return http.post(url,formData, httpOptions);
  }

  wertpapierverkaufErfassen(http: HttpClient, depotName: string, date: string, wertpapiername: string, anzahl: string, wertpapierPreis: string, transaktionskosten: string): Observable<any>{
    const url = this.rootUrl + "depot/addTransaction";

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization":`Bearer ${this.userService.getToken()}`,
      })
    };

    const formData = new FormData();

    formData.append("depotName",depotName);
    formData.append("date",date);
    formData.append("wertpapiername",wertpapiername);
    formData.append("anzahl",anzahl);
    formData.append("wertpapierPreis",wertpapierPreis);
    formData.append("transaktionskosten",transaktionskosten);
    formData.append("transaktionsart", "VERKAUF");

    return http.post(url,formData, httpOptions);
  }



}
