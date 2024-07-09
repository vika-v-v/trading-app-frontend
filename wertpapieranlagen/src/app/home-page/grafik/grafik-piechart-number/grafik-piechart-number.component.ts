import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';

@Component({
  selector: 'app-grafik-piechart-number', // CSS-Selector zur Identifikation der Komponente
  standalone: true, // Die Komponente ist eigenständig
  imports: [], // Importierte Module und Komponenten (hier leer)
  templateUrl: './grafik-piechart-number.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./grafik-piechart-number.component.css'] // Pfad zur CSS-Datei der Komponente
})
export class GrafikPiechartNumberComponent implements Updateable { // Implementieren der Updateable Schnittstelle
  private chart: Chart<'pie', number[], string> | undefined; // Variable zur Speicherung des Chart-Objekts

  // Konstruktor zur Initialisierung der benötigten Services
  constructor(
    private depotService: DepotService,
    private depotDropdownService: DepotDropdownService,
    private updateEverythingService: UpdateEverythingService
  ) {
    Chart.register(...registerables); // Registrieren der Chart.js-Module
    updateEverythingService.subscribeToUpdates(this); // Abonnieren von Updates des UpdateEverythingService
  }

  // Methode zur Aktualisierung der Komponente, die durch Updates aufgerufen wird
  update(): void {
    this.generateDiagramm(); // Generieren des Diagramms
  }

  // Methode zum Generieren des Diagramms
  generateDiagramm() {
    if (this.chart) {
      this.chart.destroy();  // Zerstören des alten Diagramms
    }

    // Abrufen der Wertpapiere des ausgewählten Depots
    this.depotService.getWertpapiere(this.depotDropdownService.getDepot()).subscribe(response => {
      const wertpapiere = response.data; // Speichern der Wertpapiere aus der Antwort

      // Umwandeln der Daten in das benötigte Format
      const data = Object.keys(wertpapiere).map(key => ({
        name: key,
        value: parseFloat(wertpapiere[key].WertpapierAnteil)
      }));

      // Erstellen der Labels und Daten für das Diagramm
      const labels = data.map(wp => `${wp.name}: ${wp.value}`);
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
            title: {
              display: true, // Anzeige des Titels
              text: 'Wertpapieranteil in Stück', // Text des Titels
              color: 'white', // Farbe des Titels
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif', // Schriftart des Titels
                size: 15 // Schriftgröße des Titels
              }
            },
            tooltip: {
              callbacks: {
                // Anpassung des Tooltips
                label: function (tooltipItem: any) {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value}`;
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
      const canvas = document.getElementById('pieChartNumbers') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
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
