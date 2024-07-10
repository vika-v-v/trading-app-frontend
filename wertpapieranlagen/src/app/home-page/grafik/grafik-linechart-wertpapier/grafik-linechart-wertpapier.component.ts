import { Component, OnChanges, Input, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';

// Definiert die Struktur der API-Antwort, die von der Server-API zurückgegeben wird
interface ApiResponse {
  message: string; // Nachricht der API
  statusCode: number; // Statuscode der API-Antwort
  data: { // Datenobjekt mit verschachtelten Eigenschaften für Wertpapierinformationen
    [key: string]: {
      [key: string]: {
        GesamtwertKaufpreis: string;
        GesamtWertAktuell: string;
        WertpapierDurchschnittspreis: string;
        WertpapierArt: string;
        WertpapierPreisAktuell: string;
        WertpapierAnteil: string;
      }
    }
  }
}

@Component({
  standalone: true, // Die Komponente ist eigenständig und benötigt keine Module
  selector: 'app-grafik-linechart-wertpapier', // CSS-Selector zur Identifikation der Komponente
  templateUrl: './grafik-linechart-wertpapier.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./grafik-linechart-wertpapier.component.css'] // Pfad zur CSS-Datei der Komponente
})
export class GrafikLinechartWertpapierComponent implements OnChanges, AfterViewInit {
  @ViewChild('lineChartWertpapierWert') lineChartWertpapierWert!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line', number[], string> | undefined; // Instanz des Diagramms
  private xValues: string[] = []; // X-Werte für das Diagramm (Datenpunkte)
  private yValues: number[] = []; // Y-Werte für das Diagramm (Datenpunkte)

  @Input() aktienName!: string; // Name der Aktie, der von außen übergeben wird

  @Input() selectedDepot: string | null = null; // Ausgewähltes Depot
  @Input() selectedAktie: string | null = null; // Ausgewählte Aktie

  constructor(private depotService: DepotService) {
    Chart.register(...registerables); // Registrieren der Chart.js-Module
  }

  ngAfterViewInit(): void {
    this.generateLineChart_WertpapierWert();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Überprüfen, ob sich der Aktienname geändert hat, und das Diagramm neu generieren
    if (changes['aktienName']) {
      this.generateLineChart_WertpapierWert();
    }
    // Überprüfen, ob sich das ausgewählte Depot oder die ausgewählte Aktie geändert hat, und das Diagramm neu generieren
    if ((changes['selectedDepot'] || changes['selectedAktie'])) {
      this.generateLineChart_WertpapierWert();
    }
  }

  generateLineChart_WertpapierWert() {
    const depotName = this.depotService.getCurrentDepot();

    // Abrufen des historischen Wertverlaufs der Wertpapiere über die API
    this.depotService.getWertverlauf(depotName).subscribe(
      (response: ApiResponse) => {

        this.xValues = []; // Zurücksetzen der X-Werte
        this.yValues = []; // Zurücksetzen der Y-Werte

        const data = response.data; // Daten aus der API-Antwort extrahieren

        // Iterieren über die Datenpunkte und Werte für das Diagramm vorbereiten
        for (const date in data) {
          if (data.hasOwnProperty(date)) {
            const stocks = data[date];
            if (stocks.hasOwnProperty(this.aktienName)) {
              this.xValues.push(date); // Hinzufügen des Datums zur X-Achse
              this.yValues.push(parseFloat(stocks[this.aktienName].WertpapierDurchschnittspreis.replace(',', '.'))); // Hinzufügen des Wertes zur Y-Achse
            }
          }
        }

        // Konfigurieren der Diagramm-Einstellungen
        const chartConfig: ChartConfiguration<'line', number[], string> = {
          type: 'line', // Typ des Diagramms
          data: {
            labels: this.xValues, // Labels für die X-Achse
            datasets: [
              {
                label: `${this.aktienName} Durchschnittspreis`, // Beschriftung des Datensatzes
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
                  stepSize: 1 // Schrittweite der Skalenstriche
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
        const canvas = document.getElementById('lineChartWertpapierWert') as HTMLCanvasElement;
        if (canvas) {
          // Erstellen eines neuen Diagramms mit der konfigurierten Einstellung und den Daten
          this.chart = new Chart(canvas, chartConfig);
        }
      }
    );
  }
}
