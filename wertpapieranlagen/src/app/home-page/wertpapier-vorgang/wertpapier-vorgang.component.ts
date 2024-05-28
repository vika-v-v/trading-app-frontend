import { Component, Input } from '@angular/core';
import { WertpapierVorgang } from '../wertpapier-vorgang.enum';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WertpapierKaufService } from '../../services/wertpapier-kauf.service';
import { FormsModule } from '@angular/forms';

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

  depotname!: string;
  date!: string;
  wertpapiername!: string;
  anzahl!: string;
  wertpapierPreis!: string;
  transaktionskosten!: string;

  currentDate!: string;

  constructor(private httpClient: HttpClient, private wertpapierKaufService: WertpapierKaufService){

  }

  ngOnInit() {
    this.currentDate = this.formatDate(new Date());
  }

  kaufHinzufuegen(){
    this.wertpapierKaufService.wertpapierkaufErfassen(this.httpClient, "Depot1", "01.01.2024", this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
      response=>{

      },
      error=>{
        console.log(error.message);
      }
    );
  }

  verkaufHinzufuegen(){
    this.wertpapierKaufService.wertpapierverkaufErfassen(this.httpClient, "Depot1", "01.01.2024", this.wertpapiername, this.anzahl, this.wertpapierPreis, this.transaktionskosten).subscribe(
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
}

