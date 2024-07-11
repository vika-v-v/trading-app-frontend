import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepotMockService {

  depots: any[] = [];

  constructor() { }

  initTestUserDepots() {

  }

  getDepots(): any {
    return {
      message: "Depots successfully fetched",
      statusCode: 200,
      data: [
        {
          name: "Depot 1",
          waehrung: "EUR"
        },
        {
          name: "Depot 2",
          waehrung: "USD"
        }
      ]
    };
  }
}
