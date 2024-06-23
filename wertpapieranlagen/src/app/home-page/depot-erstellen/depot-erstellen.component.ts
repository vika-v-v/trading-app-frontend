import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DepotService } from '../../services/depot.service';
import { FormsModule } from '@angular/forms';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService } from '../../services/update-everything.service';
import { PopUpService } from '../../services/pop-up.service';


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
  moeglicheWaehrungen = ['Euro', 'US-Dollar'];

  @Output() onAbbrechen = new EventEmitter<void>();

  constructor(private httpClient: HttpClient, private depotDropdownService: DepotDropdownService, private depotService: DepotService, private updateEverythingService: UpdateEverythingService, private popupService: PopUpService) {
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
  }

  abbrechen() {
    this.name = "";
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
    this.onAbbrechen.emit();
  }

  changeWaehrung(waehrung: string) {
    this.selectedWaehrung = waehrung;
  }

  depotErstellen(){
    let waehrungKuerzel = this.selectedWaehrung === 'Euro' ? 'EUR' : 'USD';
    this.depotService.depotErstellen(this.httpClient, this.name, waehrungKuerzel).subscribe(
      response=>{
        this.updateEverythingService.updateAll();
        this.abbrechen();
        //this.depotDropdownService.reloadDepots();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Erstellen des Depots: " + error.error.message);
      }
    );
  }
}

