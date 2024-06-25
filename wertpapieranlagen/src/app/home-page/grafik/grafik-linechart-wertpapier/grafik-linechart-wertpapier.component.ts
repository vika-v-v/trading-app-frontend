import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';
import { Observable } from 'rxjs';

interface ApiResponse {
  message: string;
  statusCode: number;
  data: {
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
  standalone: true,
  selector: 'app-grafik-linechart-wertpapier',
  templateUrl: './grafik-linechart-wertpapier.component.html',
  styleUrls: ['./grafik-linechart-wertpapier.component.css']
})
export class GrafikLinechartWertpapierComponent implements Updateable {
  private chart: Chart<'line', number[], string> | undefined;
  private xValues: string[] = [];
  private yValues: number[] = [];
  private aktienName: string = "";

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService) {
    Chart.register(...registerables);
    updateEverythingService.subscribeToUpdates(this);

    // Registriere den Service-Observer für Änderungen des ausgewählten Aktiennamens
    this.depotDropdownService.getAktie().subscribe((aktie) => {
      if (aktie) {
        this.aktienName = aktie;
        this.generateLineChart_WertpapierWert();
      }
    });
  }

  update(): void {
    // Aktualisierung des Diagramms
    this.depotDropdownService.getAktie().subscribe((aktie) => {
      if (aktie) {
        this.aktienName = aktie;
        this.generateLineChart_WertpapierWert();
      }
    });
  }

  async generateLineChart_WertpapierWert() {
    try {
      const depotName = this.depotDropdownService.getDepot();
      console.log('Depot Name:', depotName);  // Debugging
      console.log('Ausgewählte Aktie:', this.aktienName);  // Debugging

      const response: ApiResponse = await this.depotService.getWertverlauf(this.http, depotName).toPromise();
      console.log('Response:', response);  // Debugging

      this.xValues = [];
      this.yValues = [];

      const data = response.data;

      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          const stocks = data[date];
          if (stocks.hasOwnProperty(this.aktienName)) {
            this.xValues.push(date);
            this.yValues.push(parseFloat(stocks[this.aktienName].WertpapierDurchschnittspreis.replace(',', '.')));
          }
        }
      }

      console.log('X Values:', this.xValues);  // Debugging
      console.log('Y Values:', this.yValues);  // Debugging

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: {
          labels: this.xValues,
          datasets: [
            {
              label: `${this.aktienName} Durchschnittspreis`,
              fill: false,
              tension: 0,
              backgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: 'rgba(255, 255, 255, 1)',
              data: this.yValues,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              ticks: {
                stepSize: 1
              },
              grid: {
                drawOnChartArea: true
              }
            }
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }

      const canvas = document.getElementById('lineChartWertpapierWert') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }
    } catch (error) {
      console.error('Error fetching historical stock data:', error);
    }
  }
}
