import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service'

@Component({
  standalone: true,
  selector: 'app-grafik-linechart-wertpapier',
  templateUrl: './grafik-linechart-wertpapier.component.html',
  styleUrls: ['./grafik-linechart-wertpapier.component.css']
})
export class GrafikLinechartWertpapierComponent implements Updateable {
  @Input() aktienname: string = 'Apple'; // Default to 'Apple'
  private chart: Chart | undefined;

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService) {
    Chart.register(...registerables);
    updateEverythingService.subscribeToUpdates(this);
  }

  update(): void {
    this.generateLineChart_WertpapierWert();
  }

  /*ngOnChanges(changes: SimpleChanges) {
    if (changes['aktienname']) {
      if (this.aktienname) {
        this.generateLineChart_WertpapierWert();
      }
    }
  }*/

  async generateLineChart_WertpapierWert() {
    try {
      const depotName = 'ThoresDepot';//this.depotDropdownService.getDepot();
      const input = await this.depotService.getWertverlauf(this.http, depotName).toPromise();
      const xValues: string[] = [];
      const yValues: number[] = [];

      const data = input.data;

      let firstDate: string | undefined;
      let lastDate: string | undefined;

      for (const date in data) {
        xValues.push(date);
        if (data[date][this.aktienname]) {
          const stockData = data[date][this.aktienname];
          const averagePrice = parseFloat(stockData.WertpapierDurchschnittspreis.replace(',', '.'));
          yValues.push(averagePrice);

          if (!firstDate) {
            firstDate = date; // Set first date when data for aktienname is found
          }
          lastDate = date; // Always update last date with current date
        } else {
          yValues.push(0); // Handle case when data for aktienname is not available for the date
        }
      }

      const minPrice = Math.min(...yValues.filter(value => value !== 0)) * 0.9;
      const maxPrice = Math.max(...yValues.filter(value => value !== 0)) * 1.1;

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [
            {
              label: this.aktienname,
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
              min: minPrice,
              max: maxPrice,
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

      const canvas = document.getElementById('lineChartWertpapierWert') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }

      console.log('First Date:', firstDate);
      console.log('Last Date:', lastDate);

    } catch (error) {
      console.error('Fehler beim Abrufen des Wertverlaufs:', error);
    }
  }
}
