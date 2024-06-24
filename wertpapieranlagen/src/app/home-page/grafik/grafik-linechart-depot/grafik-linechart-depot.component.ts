import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';
import { map } from 'rxjs/operators';

interface ApiResponse {
  message: string;
  statusCode: number;
  data: Data;
}

interface Data {
  [key: string]: number;
}

@Component({
  standalone: true,
  imports: [],
  selector: 'app-grafik-linechart-depot',
  templateUrl: './grafik-linechart-depot.component.html',
  styleUrls: ['./grafik-linechart-depot.component.css']
})
export class GrafikLinechartDepotComponent implements Updateable {
  private chart: Chart<'line', number[], string> | undefined;
  private xValues: string[] = [];
  private yValues: number[] = [];

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService, private userService: UserService) {
    Chart.register(...registerables);
    updateEverythingService.subscribeToUpdates(this);
  }

  update(): void {
    this.generateLineChart_DepotWert();
  }

  async generateLineChart_DepotWert() {
    try {
      const depotName = this.depotDropdownService.getDepot();
      const response: ApiResponse = await this.depotService.getDepotHistory(this.http, depotName).toPromise();

      this.xValues = [];
      this.yValues = [];

      const data = response.data;

      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          this.xValues.push(date);
          this.yValues.push(data[date]);
        }
      }

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line',
        data: {
          labels: this.xValues,
          datasets: [
            {
              label: 'Depot Wert',
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
                stepSize: 50
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
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }
    } catch (error) {
      console.error('Error fetching historical depot data:', error);
    }
  }
}
