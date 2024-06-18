import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { GrafikComponent } from './grafik/grafik.component';
import { UserService } from '../services/user.service';
import { DepotDropdownComponent } from '../depot-dropdown/depot-dropdown.component';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { NotLoggedInComponent } from '../not-logged-in/not-logged-in.component';
import { GrafikTyp } from './grafik/grafik-typ.enum';
import { NonDepotExistingComponent } from './non-depot-existing/non-depot-existing.component'; 


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
    GrafikComponent,
    DepotDropdownComponent,
    CustomDropdownComponent,
    NotLoggedInComponent,
    NonDepotExistingComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  SidePanel = SidePanel;
  WertpapierVorgang = WertpapierVorgang;
  GrafikTyp = GrafikTyp;

  expanded = false;
  _showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  transactionen: any[] = [];
  wertpapiere: any[] = [];
  depot: any = {};

  currentDepotName = '';
  wertpapierenData: any[] = [];

  showNonDepotExistingComponent: boolean = false; 

  selectTransactions = [
    { "value": "Kauf", "label": "Kaufen" },
    { "value": "Verkauf", "label": "Verkaufen" },
    { "value": "Dividende", "label": "Dividende erfassen" }
  ]

  constructor(private http: HttpClient, private depotService: DepotService, private userService: UserService) {
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
  }

  ngAfterViewInit(): void {
    this.fillCanvas();
  }

  onSelectTransaction(selectedTransaction: string) {
    if(selectedTransaction === 'Kauf') {
      this.showSidePanel(SidePanel.Kaufen);
    }
    if(selectedTransaction === 'Verkauf') {
      this.showSidePanel(SidePanel.Verkaufen);
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

  depotAendern(neuesDepot: string) {
    if(!neuesDepot || neuesDepot === '') {
      return;
    }

    this.transactionen = this.depotService.getTransaktionen(this.http, neuesDepot).data;
    //this.wertpapiere = this.mapWertpapierenData(this.depotService.getWertpapiere(this.http, neuesDepot).data);
    /*Mögliche Lösung für this.wertpapiere @Thore*/
    this.depotService.getWertpapiere(this.http, neuesDepot).subscribe(response => {
      if (response && response.data) {
        this.wertpapiere = response.data;
        this.wertpapierenData = Object.keys(this.wertpapiere).map((key: any) => {
          const wertpapier = this.wertpapiere[key];
          return [
            key,
            wertpapier.WertpapierArt,
            wertpapier.WertpapierAktuellerKurs,
            wertpapier.WertpapierAnteil,
            wertpapier.Gesamtwert
          ];
        });
      }
      else {
        this.wertpapiere = [];
        this.wertpapierenData = [];
      }
    });

    /* Speichert Werte in this.depot */
    this.depotService.getDepot(this.http, neuesDepot).subscribe(response => {
      if (response && response.data) {
        this.depot = response.data;
      }
    });

    this.currentDepotName = neuesDepot;
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

  getTransaktionen() {
    return this.transactionen.map(transaktion => {
      return [
        transaktion.transaktionsDatum,
        transaktion.wertpapier.name,
        transaktion.anzahl,
        transaktion.wertpapierPreis,
        transaktion.transaktionskosten,
        transaktion.transaktionsart,
        transaktion.gesamtkosten
      ]
    });
  }

  getWertpapieren() {
    return [
      { "wert": "Name", "typ": FilterType.Text },
      { "wert": "Art", "typ": FilterType.Object },
      { "wert": "Kurs", "typ": FilterType.Decimal },
      { "wert": "Anteil", "typ": FilterType.Decimal },
      { "wert": "Gesamtwert", "typ": FilterType.Decimal }
    ];
  }

  mapWertpapierenData(response: any) {
    const data = response;
    const mappedData = Object.keys(data).map((key: any) => ({
      name: key,
      ...data[key]
    }));
    return mappedData;
  }

  getGesamtwert(){
    return this.depot.gesamtwert || 0;
  }

  getGewinnVerlust(): number {
    return parseFloat((this.depot.depotGewinnVerlust || 0).toFixed(2));
  }
}
