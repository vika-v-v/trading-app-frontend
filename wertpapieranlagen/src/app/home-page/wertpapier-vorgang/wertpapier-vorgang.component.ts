import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WertpapierVorgang } from '../wertpapier-vorgang.enum';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WertpapierKaufService } from '../../services/wertpapier-kauf.service';
import { FormsModule } from '@angular/forms';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-wertpapier-vorgang',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './wertpapier-vorgang.component.html',
  styleUrl: './wertpapier-vorgang.component.css'
})
export class WertpapierVorgangComponent {


  WertpapierVorgang = WertpapierVorgang;

  @Input() wertpapierVorgang: WertpapierVorgang = WertpapierVorgang.Kaufen;
  @Output() onAbbrechen = new EventEmitter<void>();

  depotname!: string;
  date!: string;
  wertpapiername!: string;
  kuerzel!: string;
  anzahl!: string;
  wertpapierPreis!: string;
  transaktionskosten!: string;
  selectedWertpapierart: string = 'AKTIE';

  currentDate!: string;

  constructor(private httpClient: HttpClient, private wertpapierKaufService: WertpapierKaufService, private depotDropdownService: DepotDropdownService, private popupService: PopUpService) {}

  ngOnInit() {
    this.currentDate = this.formatDate(new Date());
  }

  kaufHinzufuegen(attempt: number = 0) {
    this.wertpapierKaufService.wertpapierkaufErfassen(this.httpClient, this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{
        this.popupService.infoPopUp("Kauf erfolgreich hinzugefügt");
        this.onAbbrechen.emit();
      },
      error=>{
        if(error.status == 404 && attempt < 3) {
          this.wertpapierKaufService.wertpapierHinzufügen(this.httpClient, this.wertpapiername, this.kuerzel, this.selectedWertpapierart).subscribe(
            response => {
              this.kaufHinzufuegen(attempt + 1);
              this.onAbbrechen.emit();
            },
            error => {
              this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers");
            }
          )
        }
        else {
          this.popupService.errorPopUp("Fehler beim Kauf des Wertpapiers");
        }
      }
    );
  }

  verkaufHinzufuegen(){
    this.wertpapierKaufService.wertpapierverkaufErfassen(this.httpClient, this.depotDropdownService.getDepot(), this.dateWithPoints(this.date), this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{

      },
      error=>{
        console.log(error.message);
      }
    );
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
    this.onAbbrechen.emit();
  }
}

