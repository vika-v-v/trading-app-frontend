import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-grafik-linechart-depot',
  templateUrl: './grafik-linechart-depot.component.html',
  styleUrls: ['./grafik-linechart-depot.component.css']
})
export class GrafikLinechartDepotComponent implements Updateable { // implements OnChanges {
  //@Input() depotName: string | null = null;
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

  /*
  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotName']) {
      if (this.depotName) {
        console.log('Input depotName:', this.depotName); // Ausgabe des Inputs auf der Konsole
        this.generateLineChart_DepotWert();
      }
    }
  }*/

  async generateLineChart_DepotWert() {
    try {
      const depotId = this.depotDropdownService.getDepot();
      const response = await this.http.get<any>(`/api/depots/${depotId}`)
        .pipe(
          map((data: any) => data.data.historischeDepotgesamtwerte)
        )
        .toPromise();

      this.xValues = [];
      this.yValues = [];

      for (const date in response) {
        this.xValues.push(date);
        this.yValues.push(response[date]);
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
              borderColor: '#B2A4A4',
              data: this.yValues,
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
                stepSize: 50 // Anpassen je nach Bedarf für die Schrittweite der Y-Achse
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
