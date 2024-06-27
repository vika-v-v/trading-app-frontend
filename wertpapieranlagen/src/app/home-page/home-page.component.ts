import { CommonModule, NgPlural } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidePanel } from './side-panel.enum';
import { WertpapierVorgang } from './wertpapier-vorgang.enum';
import { WertpapierVorgangComponent } from './wertpapier-vorgang/wertpapier-vorgang.component';
import { DepotErstellenComponent } from './depot-erstellen/depot-erstellen.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { TaxSettingsComponent } from '../user-settings/tax-settings/tax-settings.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DepotService } from '../services/depot.service';
import { TabelleComponent } from './tabelle/tabelle.component';
import { FilterType } from './tabelle/filter-type.enum';
import { UserService } from '../services/user.service';
import { DepotDropdownComponent } from '../depot-dropdown/depot-dropdown.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { NotLoggedInComponent } from '../not-logged-in/not-logged-in.component';
import { GrafikTyp } from './grafik/grafik-typ.enum';
import { NonDepotExistingComponent } from './non-depot-existing/non-depot-existing.component';
import { GrafikOverviewComponent } from './grafik/grafik-overview/grafik-overview.component';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { PopUpService } from '../services/pop-up.service';
import { Subscription } from 'rxjs';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service';
import { DepotDropdownService } from '../services/depot-dropdown.service';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    WertpapierVorgangComponent,
    DepotErstellenComponent,
    UserSettingsComponent,
    TaxSettingsComponent,
    HttpClientModule,
    TabelleComponent,
    GrafikOverviewComponent,
    DepotDropdownComponent,
    CustomDropdownComponent,
    NotLoggedInComponent,
    NonDepotExistingComponent,
    PopUpComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, Updateable {
  SidePanel = SidePanel;
  WertpapierVorgang = WertpapierVorgang;
  GrafikTyp = GrafikTyp;

  expanded = false;
  _showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  transaktionen: any[] = [];
  wertpapiere: any[] = [];
  dividende: any[] = [];
  depot: any = {};

  selectedDepot: string | null = null;
  selectedAktie: string | null = null;

  currentDepotName: string | null = null;
  wertpapierenData: any[] = [];
  transaktionenData: any[] = [];
  dividendenData: any[] = [];

  showNonDepotExistingComponent: boolean = false;

  selectTransactions = ["Kaufen", "Verkaufen", "Dividende erfassen"];

  private popUpSubscription: Subscription;
  private choiceConfirmed: boolean = false;

  constructor(private http: HttpClient, private depotService: DepotService, private depotDropdownService: DepotDropdownService, private userService: UserService, private crd: ChangeDetectorRef, private popUpService: PopUpService, private updateEverythingService: UpdateEverythingService) {
    updateEverythingService.subscribeToUpdates(this);
    this.popUpSubscription = this.popUpService.popUpVisible$.subscribe(visible => {
      if (!visible && this.choiceConfirmed) {
        this.choiceConfirmed = false;
      }
    });
  }

  ngOnInit(): void {
    this.getNumberofDepots();
  }

  isPageVisible() {
    return this.userService.getToken() != '';
  }

  showSidePanel(name: SidePanel) {
    this._showSidePanel = true;
    this.sidePanel = name;
  }

  hideSidePanel() {
    this._showSidePanel = false;
    //this.depotAktualisieren(this.currentDepotName);
  }

  ngAfterViewInit(): void {
    this.fillCanvas();
  }

  onSelectTransaction(selectedTransaction: string) {
    if (selectedTransaction === 'Kaufen') {
      this.showSidePanel(SidePanel.Kaufen);
    }
    if (selectedTransaction === 'Verkaufen') {
      this.showSidePanel(SidePanel.Verkaufen);
    }
    if (selectedTransaction === 'Dividende erfassen') {
      this.showSidePanel(SidePanel.DividendeErfassen);
    }
  }

  fillCanvas(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#e5e5e5'; // Set the fill color to grey
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
      }
    }
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  update() {
    this.getNumberofDepots();
    //this.currentDepotName = null;
    //this.crd.detectChanges();
    //if(neuesDepot === null) {
    //  return;
    //}
    this.transaktionenData = [];
    this.wertpapierenData = [];
    this.dividendenData = [];

    this.depotService.getTransaktionen(this.http, this.depotDropdownService.getDepot()).subscribe(
      response => {
        this.transaktionen = response.data;
        this.transaktionenData = Object.keys(this.transaktionen).map((key: any) => {
          const transaktion = this.transaktionen[key];
          return [
            transaktion.date,
            transaktion.wertpapier.name,
            Number(transaktion.anzahl),
            Number(transaktion.wertpapierPreis),
            Number(transaktion.transaktionskosten),
            transaktion.transaktionsart,
            Number(transaktion.gesamtkosten)
          ];
        });
      },
      error => {
        let statusCode = error.error.statusCode || error.statusCode;
        if (!(statusCode >= 200 && statusCode < 300)) {
          this.popUpService.errorPopUp('Fehler beim Laden der Tabellenwerte: ' + error.error.message);
        }
      }
    );


    //this.wertpapiere = this.mapWertpapierenData(this.depotService.getWertpapiere(this.http, neuesDepot).data);
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(
      response => {
        this.wertpapiere = response.data;
        this.wertpapierenData = Object.keys(this.wertpapiere).map((key: any) => {
          const wertpapier = this.wertpapiere[key];
          return [
            key,
            wertpapier.WertpapierArt,
            Number(wertpapier.WertpapierPreisAktuell),
            Number(wertpapier.WertpapierAnteil),
            Number(wertpapier.GesamtWertAktuell)
          ];
        });
      },
      error => {
        let statusCode = error.error.statusCode || error.statusCode;
        if (!(statusCode >= 200 && statusCode < 300)) {
          this.popUpService.errorPopUp('Fehler beim Laden der Tabellenwerte: ' + error.error.message);
        }
      }
    );

    this.depotService.getDividenden(this.http, this.depotDropdownService.getDepot()).subscribe(
      response => {
        this.dividende = response.data;
        this.dividendenData = Object.keys(this.dividende).map((key: any) => {
          const dividende = this.dividende[key];
          return [
            dividende.dividendenDatum,
            dividende.wertpapierName,
            Number(dividende.dividende)
          ];
        });
      },
      error => {
        let statusCode = error.error.statusCode || error.statusCode;
        if (!(statusCode >= 200 && statusCode < 300)) {
          this.popUpService.errorPopUp('Fehler beim Laden der Tabellenwerte: ' + error.error.message);
        }
      }
    );


    /* Speichert Werte in this.depot */
    this.depotService.getDepot(this.http, this.depotDropdownService.getDepot()).subscribe(response => {
      if (response && response.data) {
        this.depot = response.data;
      }
    },
    error => {
      let statusCode = error.statusCode || error.error.statusCode;
      if (!(statusCode >= 200 && statusCode < 300)) {
        this.popUpService.errorPopUp('Fehler beim Laden der Tabellenwerte: ' + error.error.message);
      }
    });
    //
    this.currentDepotName = this.depotDropdownService.getDepot();
  }

  getTransaktionenHeader() {
    return [
      { "wert": "Datum", "typ": FilterType.Date },
      { "wert": "Wertpapier", "typ": FilterType.Text },
      { "wert": "Anzahl", "typ": FilterType.Decimal },
      { "wert": "Wertpapierpreis", "typ": FilterType.Decimal },
      { "wert": "Transaktionskosten", "typ": FilterType.Decimal },
      { "wert": "Transaktionsart", "typ": FilterType.Object },
      { "wert": "Gesamtkosten", "typ": FilterType.Decimal }];
  }

  getWertpapierenHeader() {
    return [
      { "wert": "Name", "typ": FilterType.Text },
      { "wert": "Art", "typ": FilterType.Object },
      { "wert": "Kurs", "typ": FilterType.Decimal },
      { "wert": "Anteil", "typ": FilterType.Decimal },
      { "wert": "Gesamtwert", "typ": FilterType.Decimal }
    ];
  }

  getDividendenHeader() {
    return [
      { "wert": "Datum", "typ": FilterType.Date },
      { "wert": "Aktie", "typ": FilterType.Text },
      { "wert": "Dividende", "typ": FilterType.Decimal }
    ];
  }

  //Holen + Formatieren des Gesamtwertes
  getGesamtwert(): string {
    let value = parseFloat((this.depot.gesamtwert || 0).toFixed(2));
    return value.toFixed(2);
  }

  //Holen + Formatieren des Gewinn/Verlustes
  getGewinnVerlust(): string {
    let value = parseFloat((this.depot.depotGewinnVerlust || 0).toFixed(2));
    return value.toFixed(2);
  }

  startGetDepotExport() {
    console.log("Export gestartet");
    return this.depotService.getDataExport(this.http);
  }

  async showDepotLoeschen() {
    console.log("Loeschen gestartet" + this.currentDepotName);
    const userResponse = await this.popUpService.choicePopUp('Sind Sie sicher, dass Sie das Depot "' + this.currentDepotName + '" löschen möchten?').toPromise();
      if (userResponse) {
        console.log('Löschen bestätigt');
        if (this.currentDepotName) {
          this.depotService.deleteDepot(this.http, this.currentDepotName).subscribe({
            next: (response) => {
              console.log('Depot gelöscht:', response);
              this.popUpService.infoPopUp('Depot "' + this.currentDepotName + '" wurde gelöscht.');
              this.depotDropdownService.getAllDepots(this.http).subscribe(response => {
                this.depotDropdownService.setDepot(response.data[response.data.length - 1].name);
              },
              error => {
                console.error('Fehler beim Abrufen aller Depots: ', error.error.message);
              });
              this.updateEverythingService.updateAll();
            },
            error: (error) => {
              this.popUpService.errorPopUp('Fehler beim Löschen des Depots: ' + error.error.message);
              console.error('Error deleting depot:', error);
            }
          });
        }
      } else {
        console.log('Löschen abgebrochen');
      }

  }

  confirmChoice(confirm: boolean) {
    this.choiceConfirmed = confirm;
    this.popUpService.hidePopUp();
  }

  getNumberofDepots() {
    this.userService.getDepots(this.http).subscribe(
      (response) => {
        // Überprüfen, ob die Nachricht "Keine Depots gefunden" ist
        if (response.message === "Keine Depots gefunden") {
          this.showNonDepotExistingComponent = true;
        } else {
          this.showNonDepotExistingComponent = false;
        }
      },
      (error) => {
        /*console.error('Fehler beim Abrufen der Depots:', error);*/
        // Bei Fehler showNonDepotExistingComponent auf true setzen
        this.showNonDepotExistingComponent = true;
      }
    );
  }

  export() {
    this.depotService.getDataExport(this.http).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Aktien_Daten.xlsx'; // Der Dateiname, unter dem die Datei gespeichert wird
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.popUpService.infoPopUp('Export erfolgreich.');
      },
      (error) => {
        this.popUpService.errorPopUp('Fehler beim Export: ' + error.error.message);
      }
    );
  }

  selectedDepotChange(depot: string): void {
    this.selectedDepot = depot;
    this.selectedAktie = null; // Zurücksetzen der ausgewählten Aktie beim Ändern des Depots
  }

  selectedAktieChange(aktie: string): void {
    this.selectedAktie = aktie;
  }

  handleDepotChange(depot: string): void {
    this.selectedDepot = depot;
  }

  handleAktieChange(aktie: string): void {
    console.log('Selected Aktie in HomePage:', aktie);
  }

}
