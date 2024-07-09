import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-depot-dropdown', // CSS-Selector zur Identifikation der Komponente
  templateUrl: './depot-dropdown.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./depot-dropdown.component.css'], // Pfad zur CSS-Datei der Komponente
  standalone: true, // Die Komponente ist eigenständig
  imports: [CommonModule, FormsModule, CustomDropdownComponent] // Importieren der benötigten Module und Komponenten
})
export class DepotDropdownComponent implements OnInit, Updateable { // Implementieren der OnInit und Updateable Schnittstellen
  depots: string[] = []; // Array zur Speicherung der Depots
  filteredDepots: string[] = []; // Array zur Speicherung der gefilterten Depots
  selectedDepot: string = ''; // Variable zur Speicherung des ausgewählten Depots
  errorMessage: string = ''; // Variable zur Speicherung von Fehlermeldungen
  searchTerm: string = ''; // Variable zur Speicherung des Suchbegriffs
  //private reloadSubscription: Subscription; // Kommentar, dass die Subscription nicht verwendet wird

  firstLoad: boolean = true; // Flag zur Überprüfung, ob es der erste Ladevorgang ist

  @Output() depotChanged: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter für Änderungen des Depots
  @Output() selectedDepotChange: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter für Änderungen des ausgewählten Depots

  constructor(
    private depotService: DepotDropdownService, // Service zur Handhabung des Dropdowns
    private cdr: ChangeDetectorRef, // ChangeDetectorRef zur manuellen Änderungserkennung
    private updateEverythingService: UpdateEverythingService, // Service zur Synchronisation von Updates
    private popupService: PopUpService // Service zur Handhabung von Popups
  ) {
    updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  // Lifecycle-Hook, der bei der Initialisierung der Komponente aufgerufen wird
  ngOnInit(): void {
    this.loadDepots(); // Laden der Depots bei der Initialisierung
  }

  // Methode zur Aktualisierung der Komponente, die durch Updates aufgerufen wird
  update() {
    // Überprüfen, ob das ausgewählte Depot mit dem im Service gespeicherten Depot übereinstimmt
    if(this.selectedDepot != this.depotService.getDepot()) {
      this.selectedDepot = this.depotService.getDepot(); // Setzen des ausgewählten Depots auf das im Service gespeicherte Depot
    }
    this.loadDepots(); // Laden der Depots
  }

  // Methode zum Laden der Depots
  loadDepots() {
    // Abrufen aller Depots vom Server
    this.depotService.getAllDepots().subscribe(
      (response) => {
        let data = response.data; // Anpassen an das zurückgegebene Format
        // Überprüfen, ob Daten vorhanden sind
        if(data.length > 0) {
          // Filtern und Zuordnen der Depotnamen
          this.filteredDepots = data.map((depot: any) =>  depot.name);
          // Überprüfen, ob es der erste Ladevorgang ist
          if(this.firstLoad) {
            this.setInitialDepot(); // Setzen des initialen Depots
            this.updateEverythingService.updateAll(); // Aktualisieren aller verbundenen Komponenten
          }
          this.firstLoad = false; // Setzen des Flags auf false nach dem ersten Ladevorgang
        }
      },
      (error) => {
        this.errorMessage = 'Fehler beim Abrufen der Depots: ' + error.message; // Setzen der Fehlermeldung bei einem Fehler
        //this.popupService.errorPopUp(this.errorMessage); // Kommentar, dass das Popup nicht verwendet wird
      }
    );
  }

  // Methode zum Setzen des initialen Depots
  setInitialDepot() {
    // Überprüfen, ob gefilterte Depots vorhanden sind
    if (this.filteredDepots.length > 0) {
      this.selectedDepot = this.filteredDepots[this.filteredDepots.length - 1]; // Setzen des initialen Depots auf das letzte gefilterte Depot
      this.depotService.setDepot(this.selectedDepot); // Speichern des initialen Depots im Service
    }
  }

  // Methode zum Filtern der Depots basierend auf dem Suchbegriff
  filterDepots() {
    // Überprüfen, ob der Suchbegriff leer ist
    if (this.searchTerm.trim() === '') {
      this.filteredDepots = this.depots; // Setzen der gefilterten Depots auf alle Depots
    } else {
      // Filtern der Depots basierend auf dem Suchbegriff
      this.filteredDepots = this.depots.filter(depot =>
        depot.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }
  }

  // Methode zum Handhaben der Auswahl eines Depots
  onSelectDepot(depot: string) {
    if (depot) {
      this.selectedDepot = depot; // Setzen des ausgewählten Depots
      this.depotService.setDepot(depot); // Speichern des ausgewählten Depots im Service
      this.selectedDepotChange.emit(depot); // Emittieren des ausgewählten Depots
    }
  }

  // Methode zum Handhaben der Änderung des Depots
  handleDepotChange(depot: string): void {
    this.selectedDepotChange.emit(depot); // Emittieren des neuen Depotnamens
  }
}
