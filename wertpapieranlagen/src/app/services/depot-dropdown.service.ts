import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { UpdateEverythingService } from './update-everything.service';
import { map } from 'rxjs/operators';
import { HttpclientProviderService } from './httpclient-provider.service';

interface DepotResponse {
  message: string;
  statusCode: number;
  data: {
    depotId: string;
    name: string;
    waehrung: string;
    owner: string;
    enabled: boolean;
    steuerlast: number;
    wertpapiere: { [key: string]: number };
    dividendenErtraegeListe: any[];
    historischeKursdaten: { [date: string]: { [aktie: string]: any } };
    historischeDepotgesamtwerte: { [key: string]: number };
    depotDividendenErtrag: number;
    depotGewinnVerlust: number;
    gesamtwert: number;
    transactions: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DepotDropdownService {
  // Hier werden die Anfragen an den Server geschickt und der ausgewählte depotName gloabl gespeichert

  private rootUrl: string;
  private depot: string = '';
  private reloadSubject = new BehaviorSubject<void>(undefined);
  private selectedAktieSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(@Inject('ROOT_URL') rootUrl: string, private userService: UserService, private updateEverythingService: UpdateEverythingService, private httpProvider: HttpclientProviderService) {
    this.rootUrl = rootUrl;
  }

  setDepot(depot: string) {
    if(depot != this.depot && depot != '' && depot != null && depot != undefined) {
      this.depot = depot;
      this.updateEverythingService.updateAll();
    }
  }

  getDepot(){
    return this.depot;
  }

  getAllDepots(): Observable<any> {
    const createDepotUrl = this.rootUrl + 'depot/getAllDepots';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get(createDepotUrl, httpOptions);
  }

  getAktien(depotName: string): Observable<string[]> {
    const getAktienURL = `${this.rootUrl}depot/getDepot?depotName=${depotName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return this.httpProvider.getHttpClient().get<DepotResponse>(getAktienURL, httpOptions).pipe(
      map(response => {
        const uniqueAktien = new Set<string>();
        const data = response.data;

        // Iterate through historischeKursdaten to extract unique stock names
        if (data.historischeKursdaten) {
          for (const date in data.historischeKursdaten) {
            const kursdaten = data.historischeKursdaten[date];
            for (const aktie in kursdaten) {
              uniqueAktien.add(aktie);
            }
          }
        }

        return Array.from(uniqueAktien);
      })
    );
  }

  reloadDepots() {
    this.reloadSubject.next();
  }

  getReloadObservable(): Observable<void> {
    return this.reloadSubject.asObservable();
  }

  setAktie(aktie: string | null): void {
    this.selectedAktieSubject.next(aktie);
  }

  getAktie(): Observable<string | null> {
    return this.selectedAktieSubject.asObservable();
  }
}
