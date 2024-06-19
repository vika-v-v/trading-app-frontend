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
export class DepotErstellenComponent {
  name!: string;
  selectedWaehrung: any;

  moeglicheWaehrungen = [{'value': 'EUR', 'label': 'EUR - Euro'}, {'value': 'USD', 'label': 'USD - US-Dollar'}];

  @Output() onAbbrechen = new EventEmitter<void>();

  constructor(private httpClient: HttpClient, private depotDropdownService: DepotDropdownService, private depotService: DepotService){
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
  }

  abbrechen() {
    this.name = "";
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
    this.onAbbrechen.emit();
  }

  changeWaehrung(waehrung: string) {
    this.selectedWaehrung = this.moeglicheWaehrungen.find(w => w.value == waehrung);
  }

  depotErstellen(){
    this.depotService.depotErstellen(this.httpClient, this.name, this.selectedWaehrung.value).subscribe(
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

