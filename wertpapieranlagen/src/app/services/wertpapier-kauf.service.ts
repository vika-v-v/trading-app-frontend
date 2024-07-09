import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from "@angular/common/http";
import { UserService } from './user.service';
import { HttpclientProviderService } from './httpclient-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WertpapierKaufService {
  // Hier werden die Anfragen an den Server zum Kauf/Verkauf geschickt

  private rootUrl: string;

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService, private httpProvider: HttpclientProviderService) {
    this.rootUrl = rootUrl;
  }

  wertpapierkaufErfassen(depotName: string, date: string, wertpapiername: string, anzahl: string, wertpapierPreis: string, transaktionskosten: string): Observable<any>{
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

    return this.httpProvider.getHttpClient().post(url,formData, httpOptions);
  }

  wertpapierverkaufErfassen(depotName: string, date: string, wertpapiername: string, anzahl: string, wertpapierPreis: string, transaktionskosten: string): Observable<any>{
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

    return this.httpProvider.getHttpClient().post(url,formData, httpOptions);
  }

  wertpapierHinzufügen(name: string, kuerzel: string, art: string): Observable<any>{
    const url = this.rootUrl + "wertpapier/add";

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization":`Bearer ${this.userService.getToken()}`,
      })
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("kuerzel", kuerzel);
    formData.append("art", art);

    return this.httpProvider.getHttpClient().post(url, formData, httpOptions);
  }

}
