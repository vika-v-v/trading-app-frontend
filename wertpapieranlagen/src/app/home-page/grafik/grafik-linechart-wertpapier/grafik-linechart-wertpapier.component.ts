import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';

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
  @Input() aktienname: string = 'Apple'; // Default to 'Apple'
  private chart: Chart<'line', number[], string> | undefined;
  private xValues: string[] = [];
  private yValues: number[] = [];

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService) {
    Chart.register(...registerables);
    updateEverythingService.subscribeToUpdates(this);
  }

  update(): void {
    this.generateLineChart_WertpapierWert();
  }

  async generateLineChart_WertpapierWert() {
    console.log("Aktie Verlauf darstellt");
    try {
      const depotName = this.depotDropdownService.getDepot();
      const response: ApiResponse = await this.depotService.getWertverlauf(this.http, depotName).toPromise();

      this.xValues = [];
      this.yValues = [];

      const data = response.data;

      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          const stocks = data[date];
          if (stocks.hasOwnProperty(this.aktienname)) {
            this.xValues.push(date);
            this.yValues.push(parseFloat(stocks[this.aktienname].WertpapierDurchschnittspreis.replace(',', '.')));
          }
        }
      }

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: {
          labels: this.xValues,
          datasets: [
            {
              label: `${this.aktienname} Durchschnittspreis`,
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
                stepSize: 10
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
