import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import für HttpHeaders hinzugefügt
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpclientProviderService } from './httpclient-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  // Hier werden die Anfragen an den Server geschickt

  private rootUrl: string;

  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService, private httpProvider: HttpclientProviderService) {
    this.rootUrl = rootUrl;
  }

  depotErstellen(name: string, waehrung: string): Observable<any> {
    const createDepotUrl = this.rootUrl + 'depot/create';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    const formData = new FormData();
    formData.append('name', name);
    formData.append('waehrung', waehrung);

    return this.httpProvider.getHttpClient().post(createDepotUrl, formData, httpOptions);
  }

  depotUmbenennen(oldName: string, newName: string): Observable<any> {
    const createDepotUrl = this.rootUrl + 'depot/rename';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    const formData = new FormData();
    formData.append('oldName', oldName);
    formData.append('newName', newName);

    return this.httpProvider.getHttpClient().patch(createDepotUrl, formData, httpOptions);
  }

  getWertverlauf(depotName: string): Observable<any>{
    const getDepotWertverlaufUrl = `${this.rootUrl}depot/getWertpapierDepotHistorie?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    return this.httpProvider.getHttpClient().get(getDepotWertverlaufUrl, httpOptions);
  }

  getWertpapiere(depotName: string): Observable<any> {
    const getWertpapiereURL= `${this.rootUrl}depot/getWertpapiere?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(getWertpapiereURL, httpOptions);
  }

  getAlleWertpapiere(): Observable<any> {
    const getWertpapiereURL= `${this.rootUrl}wertpapier/getAllWertpapiere`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(getWertpapiereURL, httpOptions);
  }

  getTransaktionen(depotName: string): Observable<any> {
    const url = `${this.rootUrl}depot/getTransactions?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(url, httpOptions);
  }

  getDividenden(depotName: string): Observable<any> {
    const url = `${this.rootUrl}depot/getDividenden?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(url, httpOptions);
  }

  getDepot(depotName: string): Observable<any>{
    const getDepotUrl = `${this.rootUrl}depot/getDepot?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(getDepotUrl, httpOptions);
  }

  deleteDepot(depotName: string): Observable<any>{
    const deleteDepotUrl = `${this.rootUrl}depot/delete?name=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().delete(deleteDepotUrl, httpOptions);
  }

  getDataExport(): Observable<Blob> {
    const getDataExportURL = `${this.rootUrl}excel/download`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`,
        'Accept': 'application/octet-stream' // Erwartet einen binären Stream als Antwort
      }),
      responseType: 'blob' as 'json' // Angular erwartet einen expliziten Cast für 'blob'
    };
    return this.httpProvider.getHttpClient().get<Blob>(getDataExportURL, httpOptions);
  }

  getDepotHistory(depotName: string): Observable<any>{
    const getDepotHistoryURL = `${this.rootUrl}depot/getDepotGesamtwertHistorie?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(getDepotHistoryURL, httpOptions);
  }

  addDividende(depotName: string, wertpapierName: string, dividende: string, date: string): Observable<any>{
    //Achtung anpassen richtigen Api-Call wählen
    const addDividendeURL = `${this.rootUrl}depot/addDividende`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };

    const formData = new FormData();
    formData.append('depotName', depotName);
    formData.append('wertpapierName', wertpapierName);
    formData.append('dividende', dividende);
    formData.append('date', date);

    return this.httpProvider.getHttpClient().post(addDividendeURL, formData, httpOptions);
  }
}
