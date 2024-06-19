import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DepotService } from '../../services/depot.service';
import { FormsModule } from '@angular/forms';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';


@Component({
  selector: 'app-depot-erstellen',
  standalone: true,
  imports: [FormsModule, CustomDropdownComponent],
  templateUrl: './depot-erstellen.component.html',
  styleUrl: './depot-erstellen.component.css'
})
export class DepotErstellenComponent implements OnInit{
  currentDate!: string;
  name!: string;
  waehrung: string = 'EUR';

  moeglicheWaehrungen = [{'value': 'EUR', 'label': 'EUR - Euro'}, {'value': 'USD', 'label': 'USD - US-Dollar'}];

  @Output() onAbbrechen = new EventEmitter<void>();

  constructor(private httpClient: HttpClient, private depotDropdownService: DepotDropdownService, private depotService: DepotService){
  }

  ngOnInit() {
    this.currentDate = this.formatDate(new Date());
  }

  abbrechen() {
    this.name = "";
    this.waehrung = "";
    this.onAbbrechen.emit();
  }

  changeWaehrung(waehrung: string) {
    this.waehrung = waehrung;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  depotErstellen(){
    this.depotService.depotErstellen(this.httpClient, this.name, this.waehrung).subscribe(
      response=>{
        this.abbrechen();
        this.depotDropdownService.reloadDepots();
      },
      error=>{
        console.log(error.message);
      }
    );
  }
}

