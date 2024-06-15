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

  // 1. get-anfrage schicken check
  // 2. zu Observable machen check
  // 3. in home-page subscribe auf das observable
  getWertpapiere(http: HttpClient, depotName: string): Observable<any> {
    const getWertpapiereURL= `${this.rootUrl}depot/getWertpapiere?depotName=Depot1`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(getWertpapiereURL, httpOptions);
    // return {
    //   "message": "Wertpapiere erfolgreich abgerufen",
    //   "statusCode": 200,
    //   "data": {
    //     "Apple": {
    //       "WertpapierDurchschnittspreis": "0.0",
    //       "WertpapierArt": "AKTIE",
    //       "WertpapierAnteil": "18.0",
    //       "Gesamtwert": "0.0",
    //       "WertpapierAktuellerKurs": "100.0"
    //     },
    //     "Tesla": {
    //       "WertpapierDurchschnittspreis": "0.0",
    //       "WertpapierArt": "AKTIE",
    //       "WertpapierAnteil": "12.0",
    //       "Gesamtwert": "0.0",
    //       "WertpapierAktuellerKurs": "250.0"
    //     },
    //     "MSCI World iShares": {
    //       "WertpapierDurchschnittspreis": "0.0",
    //       "WertpapierArt": "ETF",
    //       "WertpapierAnteil": "6.0",
    //       "Gesamtwert": "0.0",
    //       "WertpapierAktuellerKurs": "100.0"
    //     },
    //     "My Fond": {
    //       "WertpapierDurchschnittspreis": "0.0",
    //       "WertpapierArt": "FOND",
    //       "WertpapierAnteil": "10.0",
    //       "Gesamtwert": "0.0",
    //       "WertpapierAktuellerKurs": "510.0"
    //     }
    //   }
    // };
  }

  getTransaktionen(http: HttpClient, depotName: string) {
    return {
      "message": "Transaktionen erfolgreich abgerufen",
      "statusCode": 200,
      "data": [
        {
          "wertpapier": {
            "name": "Apple",
            "kuerzel": "865985",
            "kurs": {},
            "id": "664f3d8ad2a3d72814148c4a"
          },
          "anzahl": 3.0,
          "wertpapierPreis": 166.8,
          "transaktionskosten": 1.0,
          "transaktionsart": "KAUF",
          "transactionId": null,
          "transaktionsDatum": "2023-12-31T23:00:00.000+00:00",
          "gesamtkosten": 501.40000000000003
        },
        {
          "wertpapier": {
            "name": "Tesla",
            "kuerzel": "A1CX3T",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 5.0,
          "wertpapierPreis": 100.0,
          "transaktionskosten": 1.0,
          "transaktionsart": "KAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-02-29T23:00:00.000+00:00",
          "gesamtkosten": 501.0
        },
        {
          "wertpapier": {
            "name": "Tesla",
            "kuerzel": "A1CX3T",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 1.0,
          "wertpapierPreis": 100.0,
          "transaktionskosten": 1.0,
          "transaktionsart": "VERKAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-03-31T22:00:00.000+00:00",
          "gesamtkosten": 101.0
        },
        {
          "wertpapier": {
            "name": "Adidas",
            "kuerzel": "ADIDAS AG NA O.N.",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 2.0,
          "wertpapierPreis": 224.5,
          "transaktionskosten": 2.0,
          "transaktionsart": "VERKAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-05-25T08:30:10.000+00:00",
          "gesamtkosten": 451.0
        },
        {
          "wertpapier": {
            "name": "Airbus",
            "kuerzel": "AIRBUS SE",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 5.0,
          "wertpapierPreis": 159.36,
          "transaktionskosten": 0.5,
          "transaktionsart": "KAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-05-24T07:30:10.000+00:00",
          "gesamtkosten": 797.3
        },
        {
          "wertpapier": {
            "name": "Airbus",
            "kuerzel": "AIRBUS SE",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 6.0,
          "wertpapierPreis": 159.36,
          "transaktionskosten": 0.6,
          "transaktionsart": "KAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-05-24T06:30:10.000+00:00",
          "gesamtkosten": 956.76
        },
        {
          "wertpapier": {
            "name": "Bayer",
            "kuerzel": "Bayer AG NA O.N.",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 20.0,
          "wertpapierPreis": 27.56,
          "transaktionskosten": 3.5,
          "transaktionsart": "VERKAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-05-20T06:30:10.000+00:00",
          "gesamtkosten": 554.7
        },
        {
          "wertpapier": {
            "name": "BMW",
            "kuerzel": "BMW ST",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 2.0,
          "wertpapierPreis": 93,
          "transaktionskosten": 0.1,
          "transaktionsart": "VERKAUF",
          "transactionId": null,
          "transaktionsDatum": "2024-05-19T06:30:10.000+00:00",
          "gesamtkosten": 186.1
        },
        {
          "wertpapier": {
            "name": "Commerzbank",
            "kuerzel": "Commerzabank AG",
            "kurs": {},
            "id": "664f3cf4d2a3d72814148c49"
          },
          "anzahl": 1.0,
          "wertpapierPreis": 15.62,
          "transaktionskosten": 0.01,
          "transaktionsart": "KAUF",
          "transactionId": null,
          "transaktionsDatum": "2023-05-19T06:30:10.000+00:00",
          "gesamtkosten": 15.63
        }
      ]
    };
  }

  getDepot(http: HttpClient, depotName: string): Observable<any>{
    const getDepotUrl = `${this.rootUrl}depot/getDepot?depotName=Depot1`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.userService.getToken()}`
      })
    };
    return http.get(getDepotUrl, httpOptions);
  }
}
