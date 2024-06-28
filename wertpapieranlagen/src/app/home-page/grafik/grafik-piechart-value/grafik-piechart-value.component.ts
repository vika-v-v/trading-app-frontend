import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy,  AfterViewInit, ElementRef, ViewChild } from '@angular/core'; 
import { Chart, ChartConfiguration, registerables } from 'chart.js'; 
import { DepotService } from '../../../services/depot.service'; 
import { DepotDropdownService } from '../../../services/depot-dropdown.service'; 
import { HttpClient } from '@angular/common/http'; 
import { Subscription } from 'rxjs'; 
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service'; 

@Component({
  selector: 'app-grafik-piechart-value', // CSS-Selector zur Identifikation der Komponente
  standalone: true, // Die Komponente ist eigenständig
  imports: [], // Importierte Module und Komponenten (hier leer)
  templateUrl: './grafik-piechart-value.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./grafik-piechart-value.component.css'] // Pfad zur CSS-Datei der Komponente
})
export class GrafikPiechartValueComponent implements Updateable, AfterViewInit { // Implementieren der Updateable Schnittstelle
  //@Input() depotName: string | null = null;
  @ViewChild('pieChartValues') pieChartValues!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'pie', number[], string> | undefined; // Variable zur Speicherung des Chart-Objekts

  constructor(
    private depotService: DepotService,
    private http: HttpClient,
    private depotDropdownService: DepotDropdownService,
    private updateEverythingService: UpdateEverythingService
  ) {
    Chart.register(...registerables); // Registrieren der Chart.js-Module
    updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  ngAfterViewInit(): void {
    this.update();
  }

  update(): void {
    this.generatePizzaDiagrammValue(); // Generieren des Diagramms bei Update
  }

  // Methode zum Generieren des Diagramms
  generatePizzaDiagrammValue() {
    if (this.chart) {
      this.chart.destroy();  // Zerstören des alten Diagramms
    }

    // Abrufen der Wertpapiere des ausgewählten Depots
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(response => {
      const wertpapiere = response.data; // Speichern der Wertpapiere aus der Antwort

      // Umwandeln der Daten in das benötigte Format
      const data = Object.keys(wertpapiere).map(key => ({
        name: key,
        value: parseFloat(wertpapiere[key].GesamtwertKaufpreis.replace(',', '.'))
      }));

      // Erstellen der Labels und Daten für das Diagramm
      const labels = data.map(wp => `${wp.name}: $${wp.value.toFixed(2)}`);
      const datasets = [{
        data: data.map(wp => wp.value),
        backgroundColor: data.map(() => this.getRandomColor()), // Zufällige Farben für die Segmente
        borderColor: 'rgba(255, 255, 255, 1)', // Weiße Randfarbe
        borderWidth: 1 // Breite der Randlinie
      }];

      // Konfiguration des Diagramms
      const chartConfig: ChartConfiguration<'pie', number[], string> = {
        type: 'pie', // Typ des Diagramms
        data: {
          labels: labels, // Labels für die Segmente
          datasets: datasets // Daten für die Segmente
        },
        options: {
          responsive: true, // Responsives Design
          maintainAspectRatio: false, // Beibehalten des Seitenverhältnisses
          plugins: {
            legend: {
              position: 'bottom', // Position der Legende
              labels: {
                color: '#DBD1D1', // Farbe der Legende
                font: {
                  family: 'Verdana, Geneva, Tahoma, sans-serif' // Schriftart der Legende
                }
              }
            },
            tooltip: {
              callbacks: {
                // Anpassung des Tooltips
                label: function (tooltipItem: any) {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: $${value.toFixed(2)}`;
                }
              },
              titleFont: {
                family: 'Verdana, Geneva, Tahoma, sans-serif', // Schriftart des Tooltips
                size: 12 // Schriftgröße des Tooltips
              },
              bodyFont: {
                family: 'Verdana, Geneva, Tahoma, sans-serif', // Schriftart des Tooltips
                size: 10 // Schriftgröße des Tooltips
              }
            }
          }
        }
      };

      // Erstellen des Diagramms auf dem Canvas-Element
      const canvas = document.getElementById('pieChartValues') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }
    });
  }

  // Methode zur Generierung einer zufälligen Farbe
  getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  }
}
