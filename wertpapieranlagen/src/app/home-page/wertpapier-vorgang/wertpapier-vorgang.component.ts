import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { WertpapierVorgang } from '../wertpapier-vorgang.enum';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
    HttpClientModule,
    FormsModule,
    CustomDropdownComponent
  ],
  templateUrl: './wertpapier-vorgang.component.html',
  styleUrl: './wertpapier-vorgang.component.css'
})
export class WertpapierVorgangComponent implements OnInit, Updateable {
  WertpapierVorgang = WertpapierVorgang;

  @Input() wertpapierVorgang: WertpapierVorgang = WertpapierVorgang.Kaufen;
  @Output() onAbbrechen = new EventEmitter<void>();

  date: string = '';
  wertpapiername: string = '';
  kuerzel: string = '';
  anzahl: string = '';
  wertpapierPreis: string = '';
  transaktionskosten: string = '';
  dividende: string = '';

  selectedWertpapierart: string;
  moeglicheWertpapierarten = ['Aktie', 'ETF','Fond'];

  alleWertpapiere: any[] = [];

  previousKuerzel: string = '';
  previousSelectedWertpapierart: any;

  suggestion = "";
  allowSuggestions = false;
  invalidFields: any = {};

  constructor(private httpClient: HttpClient, private wertpapierKaufService: WertpapierKaufService, private depotDropdownService: DepotDropdownService, private popupService: PopUpService, private depotService: DepotService, private updateEverythingService: UpdateEverythingService) {
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

  updateAlleWertpapiere(): void {
    this.depotService.getAlleWertpapiere(this.httpClient).subscribe(
      response => {
        this.alleWertpapiere = response.data;
      },
      error => {
        this.popupService.errorPopUp("Fehler beim Laden der Wertpapiere: " + error.error.message);
      }
    );

    if(this.wertpapierVorgang != WertpapierVorgang.Kaufen) {
      this.depotService.getWertpapiere(this.httpClient, this.depotDropdownService.getDepot()).subscribe(
        response => {
          let wertpapiere = response.data;

          let wertpapierNames = Object.keys(wertpapiere);
          this.alleWertpapiere = this.alleWertpapiere.filter(w => wertpapierNames.includes(w.name));
        },
        error => {
          this.popupService.errorPopUp("Fehler beim Laden der Wertpapiere: " + error.error.message);
        }
      );
    }
  }

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
      }
      else {
        this.kuerzel = this.previousKuerzel;
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
    const matchingWertpapier = this.alleWertpapiere.find(w => w.name.toLowerCase().startsWith(this.wertpapiername.toLowerCase()));
    if (matchingWertpapier) {
      this.suggestion = matchingWertpapier.name.replace(new RegExp('^' + this.wertpapiername, 'i'), '');
    }
  }

  onKeydown(event: KeyboardEvent) {
    if ((event.key === 'Tab' || event.key === 'Enter') && this.suggestion) {
      const wertpapier = this.alleWertpapiere.find(w => w.name.toLowerCase() == (this.wertpapiername + this.suggestion).toLowerCase());
      this.wertpapiername = wertpapier.name;
      this.suggestion = '';
      this.wertpapiernameChange();
      event.preventDefault();
    }
  }

  kuerzelChange() {
    this.previousKuerzel = this.kuerzel;
  }

  validateInputs() {
    this.invalidFields = {
      wertpapiername: !this.wertpapiername,
      kuerzel: !this.kuerzel,
      date: !this.date,
      wertpapierPreis: !this.wertpapierPreis,
      anzahl: !this.anzahl,
      transaktionskosten: !this.transaktionskosten
    };

    return Object.values(this.invalidFields).every(value => !value);
  }

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

    this.wertpapierKaufService.wertpapierkaufErfassen(this.httpClient, this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{
        this.popupService.infoPopUp("Kauf erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        if(error.status == 404 && attempt < 3) {
          this.wertpapierKaufService.wertpapierHinzufügen(this.httpClient, this.wertpapiername, this.kuerzel, this.selectedWertpapierart.toUpperCase()).subscribe(
            response => {
              this.kaufHinzufuegen(attempt + 1);
            },
            error => {
              if(error.error.message) {
                this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers: " + error.error.message);
              }
              else {
                this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers. Versuchen Sie bitte später erneut.");
              }
            }
          )
        }
        else {
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

  verkaufHinzufuegen(){
    if (!this.validateInputs()) {
      this.popupService.errorPopUp('Bitte alle Felder ausfüllen.');
      return;
    }

    this.wertpapierKaufService.wertpapierverkaufErfassen(this.httpClient, this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{
        this.popupService.infoPopUp("Verkauf erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Verkauf des Wertpapiers.");
      }
    );
  }

  changeWertpapierart(wertpapierart: string) {
    this.selectedWertpapierart = wertpapierart;
    this.previousSelectedWertpapierart = this.selectedWertpapierart;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  dateWithPoints(date: string): string {
    return date.split('-').reverse().join('.');
  }

  abbrechen() {
    this.selectedWertpapierart = this.moeglicheWertpapierarten[0];
    this.wertpapiername = '';
    this.kuerzel = '';
    this.anzahl = '';
    this.wertpapierPreis = '';
    this.transaktionskosten = '';
    this.date = this.formatDate(new Date());

    this.onAbbrechen.emit();
  }

  dividendeHinzufuegen() {
    if (!this.wertpapiername || !this.dividende || !this.date) {
      this.invalidFields = {
        wertpapiername: !this.wertpapiername,
        dividende: !this.dividende,
        date: !this.date
      };
      return;
    }

    // Logik zum Hinzufügen der Dividende hier einfügen
    const dividendeDetails = {
      wertpapiername: this.wertpapiername,
      dividende: this.dividende,
      date: this.date
    };
    console.log('Dividende hinzufügen:', dividendeDetails);

    this.depotService.addDividende(this.httpClient, "ThoresDepot", "Microsoft", "12", "01.01.2024").subscribe(
      response=>{
        this.popupService.infoPopUp("Dividende erfolgreich hinzugefügt.");
        this.abbrechen();
        this.updateEverythingService.updateAll();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Erfassen der Dividende.");
      }
    );
  }

}

