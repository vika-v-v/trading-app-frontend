import { CommonModule } from '@angular/common';
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
    if (this.getDepot() === null) {
      // Wenn getDepot() null ist, setze eine Variable oder Flagge
      this.showNonDepotExistingComponent = true;
    }
  }

  getDepot(): any {
    return //this.userService.getDepot();  // Annahme, dass der UserService dies bereitstellt
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
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    if (canvas.getContext) {
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
    //this.currentDepotName = null;
    //this.crd.detectChanges();
    //if(neuesDepot === null) {
    //  return;
    //}

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
        this.tabellenZuruecksetzen(error.error.message);
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
        this.tabellenZuruecksetzen(error.error.message);
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
        this.tabellenZuruecksetzen(error.error.message);
      }
    );


    /* Speichert Werte in this.depot */
    this.depotService.getDepot(this.http, this.depotDropdownService.getDepot()).subscribe(response => {
      if (response && response.data) {
        this.depot = response.data;
      }
    });
    //
    this.currentDepotName = this.depotDropdownService.getDepot();
  }

  tabellenZuruecksetzen(fehler: string | null = null) {
    this.wertpapiere = [];
    this.wertpapierenData = [];
    this.dividendenData = [];
    if(fehler) this.popUpService.errorPopUp('Fehler beim Laden der Tabellenwerte: ' + fehler);
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

  getGesamtwert(): string {
    let value = parseFloat((this.depot.gesamtwert || 0).toFixed(2));
    return value.toFixed(2);
  }

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
            },
            error: (error) => {
              console.error('Error deleting depot:', error);
            }
          });
        }
      } else {
        console.log('Löschen abgebrochen');
      }
    this.updateEverythingService.updateAll();
  }

  confirmChoice(confirm: boolean) {
    this.choiceConfirmed = confirm;
    this.popUpService.hidePopUp();
  }
}
