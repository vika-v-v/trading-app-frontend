import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidePanel } from './side-panel.enum';
import { WertpapierVorgang } from './wertpapier-vorgang.enum';
import { WertpapierVorgangComponent } from './wertpapier-vorgang/wertpapier-vorgang.component';
import { DepotErstellenComponent } from './depot-erstellen/depot-erstellen.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { TaxSettingsComponent } from '../user-settings/tax-settings/tax-settings.component';
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
import { UpdateEverythingService, Updateable } from '../services/update-everything.service';
import { DepotUmbenennenComponent } from './depot-umbenennen/depot-umbenennen.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    WertpapierVorgangComponent,
    DepotErstellenComponent,
    UserSettingsComponent,
    TaxSettingsComponent,
    TabelleComponent,
    GrafikOverviewComponent,
    DepotDropdownComponent,
    CustomDropdownComponent,
    NotLoggedInComponent,
    NonDepotExistingComponent,
    PopUpComponent,
    DepotUmbenennenComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements AfterViewInit, Updateable {
  // enums für HTML-Datei verfügbar machen
  SidePanel = SidePanel;
  WertpapierVorgang = WertpapierVorgang;
  GrafikTyp = GrafikTyp;

  expanded = false;

  // Gibt an, ob und welches Sidepanel angezeigt wird
  showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  // Daten, die an Tabellen übergeben werden
  wertpapierenData: any[] = [];
  transaktionenData: any[] = [];
  dividendenData: any[] = [];

  // Für die Anzeige von Depotwerten
  depot: any = {};

  // Für Grafiken
  selectedDepot: string | null = null;
  selectedAktie: string | null = null;

  currentDepotName: string | null = null;

  showNonDepotExistingComponent: boolean = false;

  // Informationen für Dropdowns
  selectTransactions = ["Kaufen", "Verkaufen", "Dividende erfassen"];
  selectDepotAktionen = ["Neues Depot erstellen", "Depot umbenennen", "Depot löschen"];

  constructor(private depotService: DepotService, private userService: UserService, private crd: ChangeDetectorRef, private popUpService: PopUpService, private updateEverythingService: UpdateEverythingService) {
    updateEverythingService.subscribeToUpdates(this);
  }

  ngAfterViewInit(): void {
    this.getNumberofDepots();
  }

  // Werte aktualisieren
  update() {
    this.getNumberofDepots();
    this.transaktionenData = [];
    this.wertpapierenData = [];
    this.dividendenData = [];

    this.updateTransaktionen();
    this.updateWertpapiere();
    this.updateDividende();
    this.updateDepotWerte();

    this.currentDepotName = this.depotService.getCurrentDepot();
  }

  // Überprüfen, ob der Nutzer eingeloggt ist
  isPageVisible() {
    return this.userService.getToken() != '';
  }

  // Update Methoden
  // ----
  private updateDepotWerte() {
    /* Speichert Werte in this.depot */
    this.depotService.getDepot(this.depotService.getCurrentDepot()).subscribe(response => {
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
  }

  private updateDividende() {
    this.depotService.getDividenden(this.depotService.getCurrentDepot()).subscribe(
      response => {
        this.dividendenData = Object.keys(response.data).map((key: any) => {
          const dividende = response.data[key];
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
  }

  private updateWertpapiere() {
    this.depotService.getWertpapiere(this.depotService.getCurrentDepot()).subscribe(
      response => {
        this.wertpapierenData = Object.keys(response.data).map((key: any) => {
          const wertpapier = response.data[key];
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
  }

  private updateTransaktionen() {
    this.depotService.getTransaktionen(this.depotService.getCurrentDepot()).subscribe(
      response => {
        this.transaktionenData = Object.keys(response.data).map((key: any) => {
          const transaktion = response.data[key];
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
  }
  // ----

  // Sidepanel anzeigen
  showNewSidePanel(name: SidePanel) {
    this.showSidePanel = true;
    this.sidePanel = name;
  }

  // Methoden um richtige Funktionalitäten bei den Depots auszuwählen
  // ----
  onSelectTransaction(selectedTransaction: string) {
    if (selectedTransaction === 'Kaufen') {
      this.showNewSidePanel(SidePanel.Kaufen);
    }
    if (selectedTransaction === 'Verkaufen') {
      this.showNewSidePanel(SidePanel.Verkaufen);
    }
    if (selectedTransaction === 'Dividende erfassen') {
      this.showNewSidePanel(SidePanel.DividendeErfassen);
    }
  }

  onSelectDepotAktion(selectedDepotAktion: string) {
    if (selectedDepotAktion === 'Neues Depot erstellen') {
      this.showNewSidePanel(SidePanel.DepotErstellen);
    }
    if (selectedDepotAktion === 'Depot umbenennen') {
      this.showNewSidePanel(SidePanel.DepotUmbenenen);
    }
    if (selectedDepotAktion === 'Depot löschen') {
      this.showDepotLoeschen();
    }
  }
  // ----

  // Unteren Bereich anzeigen/verstecken
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  // Methoden für die Tabellendaten
  // ----
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
  // ----

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

  // Depot löschen
  async showDepotLoeschen() {
    const userResponse = await this.popUpService.choicePopUp('Sind Sie sicher, dass Sie das Depot "' + this.currentDepotName + '" löschen möchten?').toPromise();
      if (userResponse) {
        if (this.currentDepotName) {
          this.depotService.deleteDepot(this.currentDepotName).subscribe({
            next: (response) => {
              this.popUpService.infoPopUp('Depot "' + this.currentDepotName + '" wurde gelöscht.');
              this.depotService.getDepots().subscribe(response => {
                this.depotService.setCurrentDepot(response.data[response.data.length - 1].name);
              });
              this.updateEverythingService.updateAll();
            },
            error: (error) => {
              this.popUpService.errorPopUp('Fehler beim Löschen des Depots: ' + error.error.message);
            }
          });
        }
      }
  }

  // Exportieren der Daten, hat eine besondere Struktur und wird über "Blobs" behandelt
  export() {
    this.depotService.getDataExport().subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Aktien_Daten.xlsx';
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

  getNumberofDepots() {
    this.depotService.getDepots().subscribe(
      (response) => {
        // Überprüfen, ob die Nachricht "Keine Depots gefunden" ist
        if (response == null || response.message === "Keine Depots gefunden") {
          this.showNonDepotExistingComponent = true;
        } else {
          this.showNonDepotExistingComponent = false;
        }
      },
      (error) => {
        this.showNonDepotExistingComponent = true;
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
}
