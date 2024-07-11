import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { depotData } from './mock-data/testuser_depots';
import { allWertpaiere } from './mock-data/mock_all_wertpapiere';
import { transactionsMyDepot } from './mock-data/transactions_my_depot';
import { transactionsExampleDepot } from './mock-data/transactions_example_depots';
import { transactionsEmptyData } from './mock-data/transactions_empty_depot';
import { dividendeEmptyDepot } from './mock-data/dividende_empty_depot';
import { dividendeMyDepot } from './mock-data/dividende_my_depot';
import { dividendeExampleDepot } from './mock-data/dividende_example_depot';
import { depotMyDepot } from './mock-data/depot_my_depot';
import { depotExampleDepot } from './mock-data/depot_example_depot';

@Injectable({
  providedIn: 'root'
})
export class DepotMockService {

  depots: any[] = [];


  constructor(private userService: UserService) { }

  initTestUserDepots() {

  }

  getDepots(): any {
    return depotData;
  }

  createDepot(): any {
    return {
      "message": "Depot erfolgreich erstellt",
      "statusCode": 201,
      "data": null
    };
  }

  renameDepot(): any {
    return {
      "message": "Depot erfolgreich umbenannt",
      "statusCode": 200,
      "data": {
        "depotId": "668fc8fcd0f6e81ac80cabdf",
        "name": "Depot 3",
        "waehrung": "USD",
        "owner": "668ea646d0f6e81ac80cabbf",
        "enabled": true,
        "steuerlast": 0.0,
        "wertpapiere": {},
        "dividendenErtraegeListe": [],
        "historischeKursdaten": {},
        "historischeDepotgesamtwerte": {},
        "depotDividendenErtrag": 0.0,
        "depotGewinnVerlust": 0.0,
        "gesamtwert": 0.0,
        "transactions": []
      }
    };
  }

  getWertverlauf(depot: string): any {
    if (!depot || depot == '') {
      return {
        "message": "WertpapierDepotHistorie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {}
      };
    }

    if (depot == 'My Depot') {
      return {
        "message": "WertpapierDepotHistorie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "10.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "683.46",
              "GesamtWertAktuell": "683.4600",
              "WertpapierDurchschnittspreis": "227.82000000000002",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "3.0"
            },
            "Boeing Co": {
              "GesamtwertKaufpreis": "4781.31",
              "GesamtWertAktuell": "4781.3100",
              "WertpapierDurchschnittspreis": "101.73",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "101.73",
              "WertpapierAnteil": "47.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "199.29000000000002",
              "GesamtWertAktuell": "199.2900",
              "WertpapierDurchschnittspreis": "199.29000000000002",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "1.0"
            },
            "NVIDIA Corporation": {
              "GesamtwertKaufpreis": "19230.0",
              "GesamtWertAktuell": "19230.0000",
              "WertpapierDurchschnittspreis": "128.2",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "128.2",
              "WertpapierAnteil": "150.0"
            }
          },
          "11.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "683.46",
              "GesamtWertAktuell": "683.4600",
              "WertpapierDurchschnittspreis": "227.82000000000002",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "3.0"
            },
            "Applied Materials Inc": {
              "GesamtwertKaufpreis": "1231.45",
              "GesamtWertAktuell": "1231.4500",
              "WertpapierDurchschnittspreis": "246.29000000000002",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "246.29",
              "WertpapierAnteil": "5.0"
            },
            "Boeing Co": {
              "GesamtwertKaufpreis": "4781.31",
              "GesamtWertAktuell": "4781.3100",
              "WertpapierDurchschnittspreis": "101.73",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "101.73",
              "WertpapierAnteil": "47.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "199.29000000000002",
              "GesamtWertAktuell": "199.2900",
              "WertpapierDurchschnittspreis": "199.29000000000002",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "1.0"
            },
            "NVIDIA Corporation": {
              "GesamtwertKaufpreis": "19230.0",
              "GesamtWertAktuell": "19230.0000",
              "WertpapierDurchschnittspreis": "128.2",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "128.2",
              "WertpapierAnteil": "150.0"
            }
          }
        }
      };
    }

    if (depot == 'Example Depot') {
      return {

        "message": "WertpapierDepotHistorie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "17.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1700.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "170.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3600.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "180.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "18.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "3450.0",
              "GesamtWertAktuell": "4556.4000",
              "WertpapierDurchschnittspreis": "172.5",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "20.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3600.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "180.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "19.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "5250.0",
              "GesamtWertAktuell": "6834.6000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "30.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3600.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "180.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "20.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "5250.0",
              "GesamtWertAktuell": "6834.6000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "30.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "7400.0",
              "GesamtWertAktuell": "18649.6000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "40.0"
            }
          },
          "21.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "7400.0",
              "GesamtWertAktuell": "18649.6000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "40.0"
            }
          },
          "22.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "23.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1800.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "180.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "24.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "3985.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "20.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "25.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "26.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "27.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "28.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "29.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "30.06.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "01.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "02.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "03.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "04.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "05.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "06.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "07.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "08.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "09.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          },
          "10.07.2024": {
            "Apple Inc": {
              "GesamtwertKaufpreis": "1750.0",
              "GesamtWertAktuell": "2278.2000",
              "WertpapierDurchschnittspreis": "175.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "227.82",
              "WertpapierAnteil": "10.0"
            },
            "Amazon(dot)com Inc": {
              "GesamtwertKaufpreis": "1850.0",
              "GesamtWertAktuell": "1992.9000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "199.29",
              "WertpapierAnteil": "10.0"
            },
            "NVIDIA Corporation": {
              "GesamtwertKaufpreis": "1282.0",
              "GesamtWertAktuell": "1282.0000",
              "WertpapierDurchschnittspreis": "128.2",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "128.2",
              "WertpapierAnteil": "10.0"
            },
            "Microsoft Corporation": {
              "GesamtwertKaufpreis": "3700.0",
              "GesamtWertAktuell": "9324.8000",
              "WertpapierDurchschnittspreis": "185.0",
              "WertpapierArt": "AKTIE",
              "WertpapierPreisAktuell": "466.24",
              "WertpapierAnteil": "20.0"
            }
          }
        }
      };
    }

    return {
      "message": "Depot Gesamtwert Historie erfolgreich abgerufen",
      "statusCode": 200,
      "data": {}
    };
  }

  getWertpapiere(depot: string): any {
    if (!depot || depot == '') {
      return {
        "message": "Keine Wertpapiere gefunden",
        "statusCode": 200,
        "data": {}
      };
    }

    if (depot == 'My Depot') {
      return {
        "message": "WertpapierDepotHistorie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "Apple Inc": {
            "GesamtwertKaufpreis": "683.46",
            "GesamtWertAktuell": "683.4600",
            "WertpapierDurchschnittspreis": "227.82000000000002",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "227.82",
            "WertpapierAnteil": "3.0"
          },
          "Applied Materials Inc": {
            "GesamtwertKaufpreis": "1231.45",
            "GesamtWertAktuell": "1231.4500",
            "WertpapierDurchschnittspreis": "246.29000000000002",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "246.29",
            "WertpapierAnteil": "5.0"
          },
          "Boeing Co": {
            "GesamtwertKaufpreis": "4781.31",
            "GesamtWertAktuell": "4781.3100",
            "WertpapierDurchschnittspreis": "101.73",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "101.73",
            "WertpapierAnteil": "47.0"
          },
          "Amazon(dot)com Inc": {
            "GesamtwertKaufpreis": "199.29000000000002",
            "GesamtWertAktuell": "199.2900",
            "WertpapierDurchschnittspreis": "199.29000000000002",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "199.29",
            "WertpapierAnteil": "1.0"
          },
          "NVIDIA Corporation": {
            "GesamtwertKaufpreis": "19230.0",
            "GesamtWertAktuell": "19230.0000",
            "WertpapierDurchschnittspreis": "128.2",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "128.2",
            "WertpapierAnteil": "150.0"
          }
        }
      };
    }

    if (depot == 'Example Depot') {
      return {
        "message": "Wertpapiere erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "Apple Inc": {
            "GesamtwertKaufpreis": "1750.0",
            "GesamtWertAktuell": "2278.2000",
            "WertpapierDurchschnittspreis": "175.0",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "227.82",
            "WertpapierAnteil": "10.0"
          },
          "Amazon(dot)com Inc": {
            "GesamtwertKaufpreis": "1850.0",
            "GesamtWertAktuell": "1992.9000",
            "WertpapierDurchschnittspreis": "185.0",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "199.29",
            "WertpapierAnteil": "10.0"
          },
          "NVIDIA Corporation": {
            "GesamtwertKaufpreis": "1282.0",
            "GesamtWertAktuell": "1282.0000",
            "WertpapierDurchschnittspreis": "128.2",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "128.2",
            "WertpapierAnteil": "10.0"
          },
          "Microsoft Corporation": {
            "GesamtwertKaufpreis": "3700.0",
            "GesamtWertAktuell": "9324.8000",
            "WertpapierDurchschnittspreis": "185.0",
            "WertpapierArt": "AKTIE",
            "WertpapierPreisAktuell": "466.24",
            "WertpapierAnteil": "20.0"
          }
        }
      };
    }

    return {
      "message": "Keine Wertpapiere gefunden",
      "statusCode": 200,
      "data": {}
    };
  }

  getAllWertpapiere(): any {
    return allWertpaiere;
  }

  getTransactions(depot: string): any {
    if (!depot || depot == '') {
      return transactionsEmptyData;
    }

    if (depot == 'My Depot') {
      return transactionsMyDepot;
    }

    if (depot == 'Example Depot') {
      return transactionsExampleDepot;
    }

    return transactionsEmptyData;
  }

  getDividents(depot: string): any {
    if (!depot || depot == '') {
      return dividendeEmptyDepot;
    }

    if (depot == 'My Depot') {
      return dividendeMyDepot;
    }

    if (depot == 'Example Depot') {
      return dividendeExampleDepot;
    }

    return dividendeEmptyDepot;
  }

  getDepot(depot: string): any {
    if (!depot || depot == '') {
      return {
        "message": "Depot erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "depotId": "668f9449d0f6e81ac80cabd5",
          "name": "Empty Depot",
          "waehrung": "USD",
          "owner": "668d3a985f6a8d72b45d5aeb",
          "enabled": true,
          "steuerlast": 0.0,
          "wertpapiere": {},
          "dividendenErtraegeListe": [],
          "historischeKursdaten": {},
          "historischeDepotgesamtwerte": {},
          "depotDividendenErtrag": 0.0,
          "depotGewinnVerlust": 0.0,
          "gesamtwert": 0.0,
          "transactions": []
        }
      }
    }

    if (depot == 'My Depot') {
      return depotMyDepot;
    }

    if (depot == 'Example Depot') {
      return depotExampleDepot;
    }

    return {
      "message": "Depot erfolgreich abgerufen",
      "statusCode": 200,
      "data": {
        "depotId": "668f9449d0f6e81ac80cabd5",
        "name": "Empty Depot",
        "waehrung": "USD",
        "owner": "668d3a985f6a8d72b45d5aeb",
        "enabled": true,
        "steuerlast": 0.0,
        "wertpapiere": {},
        "dividendenErtraegeListe": [],
        "historischeKursdaten": {},
        "historischeDepotgesamtwerte": {},
        "depotDividendenErtrag": 0.0,
        "depotGewinnVerlust": 0.0,
        "gesamtwert": 0.0,
        "transactions": []
      }
    }
  }

  deleteDepot(): any {
    return {
      "message": "Depot erfolgreich gelöscht",
      "statusCode": 200,
      "data": [
        {
          "depotId": "668fc035d0f6e81ac80cabdb",
          "name": "Depot 1",
          "waehrung": "USD",
          "owner": "668ea646d0f6e81ac80cabbf",
          "enabled": true,
          "steuerlast": 0.0,
          "wertpapiere": {
            "668d3a935f6a8d72b45d5ae6": 5.0
          },
          "dividendenErtraegeListe": [
            "668fc109d0f6e81ac80cabde"
          ],
          "historischeKursdaten": {
            "Thu Jul 11 00:00:00 CEST 2024": {
              "Apple Inc": {
                "GesamtwertKaufpreis": "2278.2",
                "GesamtWertAktuell": "2278.2000",
                "WertpapierDurchschnittspreis": "227.82",
                "WertpapierArt": "AKTIE",
                "WertpapierPreisAktuell": "227.82",
                "WertpapierAnteil": "10.0"
              }
            },
            "Thu Jul 11 00:00:01 CEST 2024": {
              "Apple Inc": {
                "GesamtwertKaufpreis": "1139.1",
                "GesamtWertAktuell": "1139.1000",
                "WertpapierDurchschnittspreis": "227.82",
                "WertpapierArt": "AKTIE",
                "WertpapierPreisAktuell": "227.82",
                "WertpapierAnteil": "5.0"
              }
            }
          },
          "historischeDepotgesamtwerte": {
            "11-07-2024": 1147.99921875
          },
          "depotDividendenErtrag": 20.0,
          "depotGewinnVerlust": 0.0,
          "gesamtwert": 1139.1,
          "transactions": [
            "668fc0efd0f6e81ac80cabdc",
            "668fc100d0f6e81ac80cabdd"
          ]
        },
        {
          "depotId": "668fc8fcd0f6e81ac80cabdf",
          "name": "Depot 4",
          "waehrung": "USD",
          "owner": "668ea646d0f6e81ac80cabbf",
          "enabled": true,
          "steuerlast": 0.0,
          "wertpapiere": {},
          "dividendenErtraegeListe": [],
          "historischeKursdaten": {},
          "historischeDepotgesamtwerte": {},
          "depotDividendenErtrag": 0.0,
          "depotGewinnVerlust": 0.0,
          "gesamtwert": 0.0,
          "transactions": []
        }
      ]
    };
  }

  export(): any {
    return {
      "message": "Impossible to export in the test version.",
      "statusCode": 400,
      "data": null
    };
  }

  getDepotHistory(depot: string): any {
    if (!depot || depot == '') {
      return {
        "message": "Depot Gesamtwert Historie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {}
      }
    }

    if (depot == 'Example Depot') {
      return {
        "message": "Depot Gesamtwert Historie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "01-07-2024": 6850.0,
          "02-07-2024": 6850.0,
          "03-07-2024": 6850.0,
          "04-07-2024": 6850.0,
          "05-07-2024": 6850.0,
          "06-07-2024": 6850.0,
          "07-07-2024": 6850.0,
          "08-07-2024": 6850.0,
          "09-07-2024": 11531.925911331176,
          "10-07-2024": 13259.399999569265,
          "11-07-2024": 13259.4,
          "17-06-2024": 5300.0,
          "18-06-2024": 7050.0,
          "19-06-2024": 8850.0,
          "20-06-2024": 12650.0,
          "21-06-2024": 8450.0,
          "22-06-2024": 5050.0,
          "23-06-2024": 6850.0,
          "24-06-2024": 8750.0,
          "25-06-2024": 6850.0,
          "26-06-2024": 6850.0,
          "27-06-2024": 6850.0,
          "28-06-2024": 6850.0,
          "29-06-2024": 6850.0,
          "30-06-2024": 6850.0
        }
      }
    }

    if (depot == 'My Depot') {
      return {
        "message": "Depot Gesamtwert Historie erfolgreich abgerufen",
        "statusCode": 200,
        "data": {
          "10-07-2024": 15561.515570733347,
          "11-07-2024": 21013.867096774193
        }
      }
    }

    return {
      "message": "Depot Gesamtwert Historie erfolgreich abgerufen",
      "statusCode": 200,
      "data": {}
    }

  }

  addDividens(): any {
    return {
      "message": "Dividende erfolgreich hinzugefügt",
      "statusCode": 200,
      "data": {
          "dividendeneintragId": "668fe27ed0f6e81ac80cabe0",
          "wertpapier": {
              "name": "Apple Inc",
              "kuerzel": "AAPL",
              "kursHistorie": {
                  "Tue Feb 13 00:00:00 CET 2024": 180.31,
                  "Wed Feb 14 00:00:00 CET 2024": 186.19,
              },
              "id": "668d3a935f6a8d72b45d5ae6",
              "wertpapierArt": "AKTIE"
          },
          "dividende": 20.0,
          "depotId": "668fc035d0f6e81ac80cabdb",
          "dividendenDatum": "2024-07-10T22:00:00.000+00:00",
          "wertpapierName": "Apple Inc",
          "transaktionsDatum": "2024-07-10T22:00:00.000+00:00"
      }
  }
  }
}

