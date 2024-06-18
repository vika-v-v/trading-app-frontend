import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-grafik-linechart-depot',
  templateUrl: './grafik-linechart-depot.component.html',
  styleUrls: ['./grafik-linechart-depot.component.css']
})
export class GrafikLinechartDepotComponent implements OnChanges {
  @Input() depotName: string | null = null;
  private chart: Chart<'line', number[], string> | undefined;

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService) {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotName']) {
      if (this.depotName) {
        console.log('Input depotName:', this.depotName); // Ausgabe des Inputs auf der Konsole
        this.generateLineChart_DepotWert();
      }
    }
  }

  async generateLineChart_DepotWert() {
    try {
      const depotName = this.depotDropdownService.getDepot();
      const input = await this.depotService.getWertverlauf(this.http, depotName).toPromise();

      console.log(depotName);// Ausgabe des Inputs auf der Konsole
      console.log(input);// Ausgabe des Inputs auf der Konsole

      const xValues: string[] = [];
      const yValues: number[] = [];

      const data = input.data;

      for (const date in data) {
        xValues.push(date);
        let dailySum = 0;

        for (const stockName in data[date]) {
          const stockData = data[date][stockName];
          const averagePrice = parseFloat(stockData.GesamtwertKaufpreis.replace(',', '.'));
          dailySum += averagePrice;
        }

        yValues.push(dailySum);
      }

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [
            {
              label: 'Depot Wert',
              fill: false,
              tension: 0,
              backgroundColor: 'rgba(75, 192, 192, 1)',
              borderColor: 'rgba(0, 0, 0, 1)',
              data: yValues,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              ticks: {
                stepSize: 5
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

      const canvas = document.getElementById('lineChartDepotWert') as HTMLCanvasElement;
      console.log(canvas);
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Wertverlaufs:', error);
    }
  }
}
