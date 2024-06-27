import { Component, OnInit } from '@angular/core'; // Importieren der grundlegenden Angular-Komponenten und -Module
import { Chart, ChartConfiguration, registerables } from 'chart.js'; // Importieren von Chart.js und seinen Konfigurationen
import { DepotService } from '../../../services/depot.service'; // Importieren des DepotService zur Datenbeschaffung
import { DepotDropdownService } from '../../../services/depot-dropdown.service'; // Importieren des DepotDropdownService zur Handhabung des Dropdowns
import { UserService } from '../../../services/user.service'; // Importieren des UserService zur Benutzerverwaltung
import { HttpClient } from '@angular/common/http'; // Importieren des HttpClient zur HTTP-Kommunikation
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service'; // Importieren des UpdateEverythingService zur Synchronisation
import { map } from 'rxjs/operators'; // Importieren von RxJS-Operatoren zur Datenverarbeitung

// Definieren der Struktur der API-Antwort
interface ApiResponse {
  message: string; // API-Nachricht
  statusCode: number; // Statuscode der API-Antwort
  data: Data; // Datenobjekt mit Datum und Werten
}

// Definieren der Struktur der Daten innerhalb der API-Antwort
interface Data {
  [key: string]: number; // Schlüssel-Wert-Paare, wobei der Schlüssel das Datum und der Wert der Depotwert ist
}

@Component({
  standalone: true, // Die Komponente ist eigenständig
  imports: [], // Keine zusätzlichen Module erforderlich
  selector: 'app-grafik-linechart-depot', // CSS-Selector zur Identifikation der Komponente
  templateUrl: './grafik-linechart-depot.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./grafik-linechart-depot.component.css'] // Pfad zur CSS-Datei der Komponente
})
export class GrafikLinechartDepotComponent implements Updateable {
  private chart: Chart<'line', number[], string> | undefined; // Chart-Instanz
  private xValues: string[] = []; // X-Werte (Datenpunkte) des Diagramms
  private yValues: number[] = []; // Y-Werte (Datenpunkte) des Diagramms

  constructor(
    private depotService: DepotService, // Service zur Handhabung von Depotdaten
    private http: HttpClient, // HTTP-Client für API-Aufrufe
    private depotDropdownService: DepotDropdownService, // Service zur Handhabung des Dropdowns
    private updateEverythingService: UpdateEverythingService, // Service zur Synchronisation von Updates
    private userService: UserService // Service zur Benutzerverwaltung
  ) {
    Chart.register(...registerables); // Registrieren von Chart.js Modulen
    updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  // Methode zur Aktualisierung der Komponente, die durch Updates aufgerufen wird
  update(): void {
    this.generateLineChart_DepotWert(); // Generieren des Diagramms
  }

  // Asynchrone Methode zur Erstellung des Diagramms
  async generateLineChart_DepotWert() {
    try {
      const depotName = this.depotDropdownService.getDepot(); // Abrufen des ausgewählten Depotnamens
      const response: ApiResponse = await this.depotService.getDepotHistory(this.http, depotName).toPromise(); // Abrufen der historischen Depotdaten

      this.xValues = []; // Zurücksetzen der X-Werte
      this.yValues = []; // Zurücksetzen der Y-Werte

      const data = response.data; // Extrahieren der Daten aus der API-Antwort

      // Iterieren über die Datenpunkte und Auffüllen der X- und Y-Werte-Arrays
      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          this.xValues.push(date); // Hinzufügen des Datums zur X-Achse
          this.yValues.push(data[date]); // Hinzufügen des Depotwerts zur Y-Achse
        }
      }

      // Konfigurieren der Diagramm-Einstellungen
      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line', // Diagrammtyp
        data: {
          labels: this.xValues, // Labels für die X-Achse
          datasets: [
            {
              label: 'Depot Wert', // Beschriftung des Datensatzes
              fill: false, // Keine Füllung unter der Linie
              tension: 0, // Keine Kurvenbildung
              backgroundColor: 'rgba(75, 192, 192, 1)', // Hintergrundfarbe der Linie
              borderColor: 'rgba(255, 255, 255, 1)', // Randfarbe der Linie
              data: this.yValues, // Y-Werte
              yAxisID: 'y' // Zuordnung zur Y-Achse
            }
          ]
        },
        options: {
          scales: {
            y: {
              type: 'linear', // Linearer Typ der Y-Achse
              position: 'left', // Position der Y-Achse (links)
              ticks: {
                stepSize: 50 // Schrittweite der Skalenstriche
              },
              grid: {
                drawOnChartArea: true // Gitterlinien auf dem Diagramm zeichnen
              }
            }
          }
        }
      };

      // Überprüfen, ob ein Diagramm vorhanden ist, und es zerstören, um ein neues zu erstellen
      if (this.chart) {
        this.chart.destroy();
      }

      // Abrufen des Canvas-Elements für das Diagramm
      const canvas = document.getElementById('lineChartDepotWert') as HTMLCanvasElement;
      if (canvas) {
        // Erstellen eines neuen Diagramms mit der konfigurierten Einstellung und den Daten
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found'); // Fehlermeldung, falls das Canvas-Element nicht gefunden wird
      }
    } catch (error) {
      console.error('Error fetching historical depot data:', error); // Fehlermeldung, falls die API-Abfrage fehlschlägt
    }
  }
}
