import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { DepotService } from '../../services/depot.service';
import { FormsModule } from '@angular/forms';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService } from '../../services/update-everything.service';
import { PopUpService } from '../../services/pop-up.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depot-erstellen',
  standalone: true,
  imports: [FormsModule, CustomDropdownComponent, CommonModule],
  templateUrl: './depot-erstellen.component.html',
  styleUrl: './depot-erstellen.component.css'
})
export class DepotErstellenComponent {
  // andere Komponenten notifizieren, wenn das Sidepanel geschlossen werden soll
  @Output() onAbbrechen = new EventEmitter<void>();

  name: string = '';
  nameFieldInvalid!: boolean;

  selectedWaehrung: any;
  moeglicheWaehrungen = ['US-Dollar']; // später können hier mehr Währungen hinzugefügt werden


  constructor(private httpClient: HttpClient, private depotDropdownService: DepotDropdownService, private depotService: DepotService, private updateEverythingService: UpdateEverythingService, private popupService: PopUpService) {
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
  }

  // Beim Abbrechen alles zurücksetzen
  abbrechen() {
    this.name = "";
    this.selectedWaehrung = this.moeglicheWaehrungen[0];
    this.onAbbrechen.emit();
  }

  // Hier wird die Anfrage zum Aktualisieren geschickt
  depotErstellen() {
    if(this.checkName()){
      this.popupService.errorPopUp('Bitte alle Felder ausfüllen.');
      return;
    }
    this.depotService.depotErstellen(this.httpClient, this.name, "USD").subscribe(
      response=>{
        this.popupService.infoPopUp("Depot erfolgreich erstellt.");
        this.depotDropdownService.setDepot(this.name);
        this.updateEverythingService.updateAll();
        this.abbrechen();
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Erstellen des Depots: " + error.error.message);
      }
    );
  }

  changeWaehrung(waehrung: string) {
    this.selectedWaehrung = waehrung;
  }

  checkName() {
    this.nameFieldInvalid = !this.name;
    return this.nameFieldInvalid;
  }

}

