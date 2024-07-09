import { Component, EventEmitter, Output } from '@angular/core';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { DepotService } from '../../services/depot.service';
import { UpdateEverythingService } from '../../services/update-everything.service';
import { PopUpService } from '../../services/pop-up.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-depot-umbenennen',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CustomDropdownComponent
  ],
  templateUrl: './depot-umbenennen.component.html',
  styleUrl: './depot-umbenennen.component.css'
})
export class DepotUmbenennenComponent {
  @Output() onAbbrechen = new EventEmitter<void>();

  name: string = '';
  nameFieldInvalid!: boolean;

  constructor(private depotDropdownService: DepotDropdownService, private depotService: DepotService, private updateEverythingService: UpdateEverythingService, private popupService: PopUpService) {}

  // Beim Abbrechen alles zurücksetzen
  abbrechen() {
    this.name = "";
    this.onAbbrechen.emit();
  }

  // Hier wird die Anfrage zum Umbenennen geschickt
  depotUmbenennen() {
    if(this.checkName()){
      this.popupService.errorPopUp('Bitte das Namensfeld ausfüllen.');
      return;
    }

    this.depotService.depotUmbenennen(this.depotDropdownService.getDepot(), this.name).subscribe(
      response=>{
        this.popupService.choicePopUp("Möchten Sie das Depot " + this.depotDropdownService.getDepot() + " auf " + this.name + " wirklich umbenennen?").subscribe((response: any) => {
          if(response) {
            this.popupService.infoPopUp("Depot erfolgreich umbenannt.");
            this.depotDropdownService.setDepot(this.name);
            this.updateEverythingService.updateAll();
            this.abbrechen();
          }
        });
      },
      error=>{
        this.popupService.errorPopUp("Fehler beim Umbenennen des Depots: " + error.error.message);
      }
    );
  }

  checkName() {
    this.nameFieldInvalid = !this.name;
    return this.nameFieldInvalid;
  }
}
