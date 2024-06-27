import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core'; 
import { GrafikLinechartDepotComponent } from '../grafik-linechart-depot/grafik-linechart-depot.component'; 
import { GrafikLinechartWertpapierComponent } from '../grafik-linechart-wertpapier/grafik-linechart-wertpapier.component'; 
import { GrafikPiechartNumberComponent } from '../grafik-piechart-number/grafik-piechart-number.component'; 
import { GrafikPiechartValueComponent } from '../grafik-piechart-value/grafik-piechart-value.component'; 
import { CommonModule } from '@angular/common'; 
import { GrafikTyp } from '../grafik-typ.enum'; 
import { AktienDropdownComponent } from '../../../aktien-dropdown/aktien-dropdown.component'; 
import { DepotService } from '../../../services/depot.service'; 
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service'; 
import { HttpClient } from '@angular/common/http'; 
import { DepotDropdownService } from '../../../services/depot-dropdown.service'; 

@Component({
  selector: 'app-grafik-overview', // CSS-Selector zur Identifikation der Komponente
  templateUrl: './grafik-overview.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./grafik-overview.component.css'], // Pfad zur CSS-Datei der Komponente
  standalone: true, // Die Komponente ist eigenständig
  imports: [
    CommonModule, 
    GrafikLinechartDepotComponent, 
    GrafikPiechartNumberComponent, 
    GrafikPiechartValueComponent, 
    GrafikLinechartWertpapierComponent, 
    AktienDropdownComponent
  ] // Importieren der benötigten Module und Komponenten
})
export class GrafikOverviewComponent implements OnInit, Updateable {
  grafikTyp = GrafikTyp; // Zuweisung der GrafikTyp-Enumeration zur lokalen Variable
  wertpapierName!: string; // Initialisierung der Wertpapier-Name Variable

  @Input() selectedDepotName: string | null = null; // Eingabewert für den ausgewählten Depotnamen
  @Input() typ!: GrafikTyp; // Eingabewert für den Grafiktyp

  @Input() selectedDepot: string | null = null; // Eingabewert für das ausgewählte Depot
  @Output() selectedAktieChange: EventEmitter<string> = new EventEmitter<string>(); // Ausgabe-EventEmitter für den ausgewählten Aktiennamen

  name = 'Grafik'; // Initialisierung des Namen-Feldes für die Grafikübersicht

  wertpapiereVorhanden: boolean = true; // Initialisierung der Variable, die anzeigt, ob Wertpapiere vorhanden sind

  constructor(
    private http: HttpClient, // HTTP-Client für API-Aufrufe
    private depotService: DepotService, // Service zur Handhabung von Depotdaten
    private depotDropdownService: DepotDropdownService, // Service zur Handhabung des Dropdowns
    private updateEverythingService: UpdateEverythingService // Service zur Synchronisation von Updates
  ) {
    updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  // Methode zur Aktualisierung der Komponente, die durch Updates aufgerufen wird
  update() {
    // Abrufen der Wertpapiere für das ausgewählte Depot
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(
      response => {
        this.wertpapiereVorhanden = true; // Setzen der Variable auf true, wenn Wertpapiere vorhanden sind
      },
      error => {
        this.wertpapiereVorhanden = false; // Setzen der Variable auf false, wenn ein Fehler auftritt
      }
    );
  }

  // Lifecycle-Hook, der bei der Initialisierung der Komponente aufgerufen wird
  ngOnInit(): void {
    // Überprüfen des Grafiktyps und Setzen des entsprechenden Namensfeldes
    if(this.typ == GrafikTyp.WertverlaufDepotwerte) {
      this.name = 'Depotverlauf';
    }
    else if(this.typ == GrafikTyp.PizzadiagrammWertpapierWert) {
      this.name = 'Gesamtwert der Wertpapiere';
    }
    else if(this.typ == GrafikTyp.PizzadiagrammWertpapierMenge) {
      this.name = 'Wertpapieranteil';
    }
    else if(this.typ == GrafikTyp.WertverlaufWertpapierWerte) {
      this.name = 'Aktien-Wertverlauf';
    }
    this.update(); // Aktualisieren der Komponente
  }

  // Lifecycle-Hook, der bei Änderungen der Eingabewerte aufgerufen wird
  ngOnChanges(changes: SimpleChanges) {
    // Überprüfen, ob der ausgewählte Depotname sich geändert hat und nicht leer ist
    if (changes['selectedDepotName'] && this.selectedDepotName && this.selectedDepotName != '') {
      console.log('Depotname: ' + this.selectedDepotName); // Debugging-Ausgabe des Depotnamens
    }
  }

  // Methode zur Aktualisierung des Wertpapiernamens
  wertpapierUpdate(aktie: string){
    this.wertpapierName = aktie; // Setzen des neuen Wertpapiernamens
  }

  // Methode zum Handhaben der Änderung des ausgewählten Aktiennamens
  handleAktieChange(aktie: string): void {
    this.selectedAktieChange.emit(aktie); // Emittieren des neuen Aktiennamens
  }
}
