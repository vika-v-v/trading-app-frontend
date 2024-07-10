import { Component, EventEmitter, OnChanges, OnInit, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service';
import { DepotService } from '../services/depot.service';

@Component({
  selector: 'app-aktien-dropdown', // CSS-Selector zur Identifikation der Komponente
  templateUrl: './aktien-dropdown.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./aktien-dropdown.component.css'], // Pfad zur CSS-Datei der Komponente
  standalone: true, // Die Komponente ist eigenständig
  imports: [CommonModule, CustomDropdownComponent] // Importieren der benötigten Module und Komponenten
})
export class AktienDropdownComponent implements OnInit, Updateable, OnChanges { // Implementieren der OnInit, Updateable und OnChanges Schnittstellen
  @Input() selectedDepot: string | null = null; // Eingabewert für das ausgewählte Depot
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter für Änderungen der Auswahl

  aktien: string[] = []; // Array zur Speicherung der Aktien
  selectedOption: string | null = null; // Variable zur Speicherung der ausgewählten Option

  constructor(private updateEverythingService: UpdateEverythingService, private depotService: DepotService) {
    this.updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  // Lifecycle-Hook, der bei Änderungen der Eingabewerte aufgerufen wird
  ngOnChanges(changes: SimpleChanges) {
    // Überprüfen, ob sich das ausgewählte Depot geändert hat und es nicht die erste Änderung ist
    if (changes['selectedDepot'] && !changes['selectedDepot'].firstChange) {
      this.loadAktien(); // Laden der Aktien
    }
  }

  // Lifecycle-Hook, der bei der Initialisierung der Komponente aufgerufen wird
  ngOnInit(): void {
    this.loadAktien(); // Laden der Aktien bei der Initialisierung
  }

  // Methode zur Aktualisierung der Komponente, die durch Updates aufgerufen wird
  update(){
    this.loadAktien(); // Laden der Aktien
  }

  // Methode zum Laden der Aktien basierend auf dem ausgewählten Depot
  loadAktien(): void {
    this.depotService.getWertpapiere(this.depotService.getCurrentDepot()).subscribe(
      (response) => {
        this.aktien = Object.keys(response.data); // Zuordnen der Aktien aus der Antwort des Servers
        // Überprüfen, ob eine Option ausgewählt ist und ob sie in der Liste der Aktien enthalten ist
        if(!this.selectedOption || !this.aktien.includes(this.selectedOption)){
          this.selectedOption = this.aktien[0]; // Setzen der ausgewählten Option auf die erste Aktie
          this.selectionChange.emit(this.selectedOption); // Emittieren der ausgewählten Option
        }
      }
    );
  }

  // Methode zum Handhaben der Auswahl einer Aktie
  onSelectAktie(aktie: string): void {
    // Überprüfen, ob die ausgewählte Aktie nicht der aktuellen Option entspricht
    if(aktie != this.selectedOption){
      this.selectionChange.emit(aktie); // Emittieren der neuen Auswahl
    }
    this.selectedOption = aktie; // Setzen der neuen ausgewählten Option
  }

  // Methode zum Handhaben der Änderung der Auswahl
  handleSelectionChange(aktie: string): void {
    this.selectionChange.emit(aktie); // Emittieren der neuen Auswahl
  }
}
