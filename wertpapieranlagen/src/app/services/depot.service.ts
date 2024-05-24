import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepotService {

  constructor() { }

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
        }
      ]
    };
  }
}
