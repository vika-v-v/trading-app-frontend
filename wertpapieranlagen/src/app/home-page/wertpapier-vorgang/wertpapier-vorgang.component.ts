import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { WertpapierVorgang } from '../wertpapier-vorgang.enum';
import { CommonModule } from '@angular/common';
import { WertpapierKaufService } from '../../services/wertpapier-kauf.service';
import { FormsModule } from '@angular/forms';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { PopUpService } from '../../services/pop-up.service';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';
import { DepotService } from '../../services/depot.service';
import { UpdateEverythingService, Updateable } from '../../services/update-everything.service';

@Component({
  selector: 'app-wertpapier-vorgang',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomDropdownComponent
  ],
  templateUrl: './wertpapier-vorgang.component.html',
  styleUrl: './wertpapier-vorgang.component.css'
})
export class WertpapierVorgangComponent implements OnInit, Updateable {
  WertpapierVorgang = WertpapierVorgang;

  // WertpapierVorgang, der durchgeführt wird
  @Input() wertpapierVorgang: WertpapierVorgang = WertpapierVorgang.Kaufen;
  @Output() onAbbrechen = new EventEmitter<void>();

  // Felder für die Eingabe der Wertpapierdaten
  date: string = '';
  wertpapiername: string = '';
  kuerzel: string = '';
  anzahl: string = '';
  wertpapierPreis: string = '';
  transaktionskosten: string = '';
  dividende: string = '';

  selectedWertpapierart: string;
  moeglicheWertpapierarten = ['Aktie', 'ETF','Fond'];

  // Variablen für die Autovervollständigung
  alleWertpapiere: any[] = [];
  wertpapiereInDiesemDepot: any[] = [];

  previousKuerzel: string = '';
  previousSelectedWertpapierart: any;
  previousKurs: string = '';

  suggestion = "";
  allowSuggestions = false;
  invalidFields: any = {};

  // Anfangswerte für die Eingabefelder
  constructor(private wertpapierKaufService: WertpapierKaufService, private depotDropdownService: DepotDropdownService, private popupService: PopUpService, private depotService: DepotService, private updateEverythingService: UpdateEverythingService) {
    this.selectedWertpapierart = this.moeglicheWertpapierarten[0];
    this.previousSelectedWertpapierart = this.selectedWertpapierart;
    this.date = this.formatDate(new Date());
    this.updateEverythingService.subscribeToUpdates(this);
  }

  ngOnInit(): void {
    this.updateAlleWertpapiere();
  }

  update(): void {
    this.updateAlleWertpapiere();
  }

  // Kauf hinzufügen, dafür eine Anfrage an den Server schicken
  kaufHinzufuegen(attempt: number = 0) {
    if (!this.validateInputs()) {
      this.popupService.errorPopUp('Bitte alle Felder ausfüllen.');
      return;
    }

    if(!this.depotDropdownService.getDepot()) {
      this.popupService.errorPopUp("Kein Depot ausgewählt");
      this.abbrechen();
      return;
    }

    this.wertpapierKaufService.wertpapierkaufErfassen(this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{
        this.popupService.infoPopUp("Kauf erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        if(error.status == 404 && attempt < 3) {
          // Falls kein Wertpapier im Datenbank gefunden wurde, wird es hinzugefügt und nochmal versucht den Kauf hinzuzufügen
          this.wertpapierKaufService.wertpapierHinzufügen(this.wertpapiername, this.kuerzel, this.selectedWertpapierart.toUpperCase()).subscribe(
            response => {
              this.kaufHinzufuegen(attempt + 1);
              this.abbrechen();
            }
          )
        }
        else {
          // Wenn Fehlerbeschreibung verfügbar ist, wird er angezeigt, sonst wird ein allgemeiner Fehler angezeigt
          if(error.error.message) {
            this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers: " + error.error.message);
          }
          else {
            this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers. Versuchen Sie bitte später erneut.");
          }
        }
      }
    );
  }

  // Verkauf hinzufügen, dafür eine Anfrage an den Server schicken
  verkaufHinzufuegen(){
    if (!this.validateInputs()) {
      this.popupService.errorPopUp('Bitte alle Felder ausfüllen.');
      return;
    }

    this.wertpapierKaufService.wertpapierverkaufErfassen(this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{
        this.popupService.infoPopUp("Verkauf erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Verkauf des Wertpapiers: " + error.error.message);
      }
    );
  }

  // Dividende hinzufügen, dafür eine Anfrage an den Server schicken
  dividendeHinzufuegen() {
    if (!this.wertpapiername || !this.dividende || !this.date) {
      this.invalidFields = {
        wertpapiername: !this.wertpapiername,
        dividende: !this.dividende,
        date: !this.date
      };
      return;
    }

    this.depotService.addDividende(this.depotDropdownService.getDepot(), this.wertpapiername, this.dividende, this.dateWithPoints(this.date)).subscribe(
      response=>{
        this.popupService.infoPopUp("Dividende erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Erfassen der Dividende: " + error.error.message);
      }
    );
  }

  // Abbrechen, alle Felder zurücksetzen
  abbrechen() {
    this.selectedWertpapierart = this.moeglicheWertpapierarten[0];
    this.wertpapiername = '';
    this.kuerzel = '';
    this.anzahl = '';
    this.wertpapierPreis = '';
    this.transaktionskosten = '';
    this.dividende = '';
    this.date = this.formatDate(new Date());

    this.onAbbrechen.emit();
  }


  // für die Autovervollständigung alle Wertpapiere laden (Vervollsändigung für Kauf)
  private updateAlleWertpapiere(): void {
    this.depotService.getAlleWertpapiere().subscribe(
      response => {
        this.alleWertpapiere = response.data;
        this.updateAlleWertpapiereInDiesemDepot();
      },
      error => {
        let statusCode = error.error.statusCode || error.statusCode;
        if (!(statusCode >= 200 && statusCode < 300)) {
          this.popupService.errorPopUp('Fehler beim Laden der Wertpapiere: ' + error.error.message);
        }
      }
    );
  }

  // für die Autovervollständigung alle Wertpapiere in diesem Depot laden (Vervollsändigung für Verkauf, Dividende Erfassen)
  private updateAlleWertpapiereInDiesemDepot() {
    this.depotService.getWertpapiere(this.depotDropdownService.getDepot()).subscribe(
      response => {
        let wertpapiere = response.data;

        let wertpapierNames = Object.keys(wertpapiere);
        this.wertpapiereInDiesemDepot = this.alleWertpapiere.filter(w => wertpapierNames.includes(w.name));
      },
      error => {
        let statusCode = error.error.statusCode || error.statusCode;
        if (!(statusCode >= 200 && statusCode < 300)) {
          this.popupService.errorPopUp('Fehler beim Laden der Wertpapiere: ' + error.error.message);
        }
      }
    );
  }

  // Autovervollständigung für Wertpapiername generieren und auch weitere Felder setzen
  wertpapiernameChange() {
    this.suggestion = '';
    if(this.wertpapiername && this.wertpapiername != '') {
      const wertpapier = this.alleWertpapiere.find(w => w.name.toLowerCase() == this.wertpapiername.toLowerCase());
      if(wertpapier) {
        this.kuerzel = wertpapier.kuerzel;

        if(wertpapier.wertpapierArt == 'ETF') {
          this.selectedWertpapierart = 'ETF';
        }
        else if(wertpapier.wertpapierArt == 'FOND') {
          this.selectedWertpapierart = 'Fond';
        }
        else {
          this.selectedWertpapierart = 'Aktie';
        }

        const dates = Object.keys(wertpapier.kursHistorie);
        const lastDate = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[dates.length - 1];
        this.wertpapierPreis = Number(wertpapier.kursHistorie[lastDate]).toString();
      }
      else {
        this.kuerzel = this.previousKuerzel;
        this.wertpapierPreis = this.previousKurs;
        this.selectedWertpapierart = this.previousSelectedWertpapierart;
      }
      this.setSuggestion();
    }
  }

  onFocusWertpapiername() {
    if(this.wertpapiername && this.wertpapiername != '') {
      this.setSuggestion();
    }
  }

  onBlurWertpapiername() {
    this.suggestion = '';
  }

  setSuggestion() {
    this.suggestion = '';
    const matchingWertpapier = this.wertpapierVorgang == WertpapierVorgang.Kaufen ?
                                      this.alleWertpapiere.find(w => w.name.toLowerCase().startsWith(this.wertpapiername.toLowerCase())) :
                                      this.wertpapiereInDiesemDepot.find(w => w.name.toLowerCase().startsWith(this.wertpapiername.toLowerCase()));
    if (matchingWertpapier) {
      this.suggestion = matchingWertpapier.name.replace(new RegExp('^' + this.wertpapiername, 'i'), '');
    }
  }

  // Vervollständigung bei Enter oder Tab akzeptieren
  onKeydown(event: KeyboardEvent) {
    if ((event.key === 'Tab' || event.key === 'Enter') && this.suggestion) {
      const wertpapier = this.alleWertpapiere.find(w => w.name.toLowerCase() == (this.wertpapiername + this.suggestion).toLowerCase());
      this.wertpapiername = wertpapier.name;
      this.suggestion = '';
      this.wertpapiernameChange();
      event.preventDefault();
    }
  }

  // Wenn der Nutzer die Daten manuell ändert dann werden sie gespeichert und beim calceln vom Vervollständigungsfeld wieder angezegt
  // ----
  kuerzelChange() {
    this.previousKuerzel = this.kuerzel;
  }

  kursChange() {
    this.previousKurs = this.wertpapierPreis;
  }

  changeWertpapierart(wertpapierart: string) {
    this.selectedWertpapierart = wertpapierart;
    this.previousSelectedWertpapierart = this.selectedWertpapierart;
  }
  // ----

  // Überprüfen, ob alle Felder ausgefüllt sind
  validateInputs() {
    this.invalidFields = {
      wertpapiername: !this.wertpapiername,
      kuerzel: !this.kuerzel,
      date: !this.date,
      wertpapierPreis: !this.wertpapierPreis,
      anzahl: !this.anzahl,
      transaktionskosten: this.transaktionskosten === '' || isNaN(Number(this.transaktionskosten))
    };

    return Object.values(this.invalidFields).every(value => !value);
  }

  // Datum in das richtige Format umwandeln

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  dateWithPoints(date: string): string {
    return date.split('-').reverse().join('.');
  }
}

