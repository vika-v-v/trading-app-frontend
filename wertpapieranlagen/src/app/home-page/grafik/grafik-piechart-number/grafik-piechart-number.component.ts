import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';

@Component({
  selector: 'app-grafik-piechart-number',
  standalone: true,
  imports: [],
  templateUrl: './grafik-piechart-number.component.html',
  styleUrls: ['./grafik-piechart-number.component.css']
})
export class GrafikPiechartNumberComponent implements Updateable { // OnChanges, OnDestroy, OnInit,
  @Input() depotName: string | null = null;
  private chart: Chart<'pie', number[], string> | undefined;
  private depotSubscription: Subscription | undefined;

  constructor(
    private depotService: DepotService,
    private http: HttpClient,
    private depotDropdownService: DepotDropdownService,
    private updateEverythingService: UpdateEverythingService
  ) {
    Chart.register(...registerables);
    updateEverythingService.subscribeToUpdates(this);
  }

  update(): void {
    this.generateDiagramm();
  }

  /*
  ngOnInit() {
    if (this.depotName) {
      console.log('Initial depotName:', this.depotName);
      this.generateDiagramm();
    }

    // Subscribe to depot changes
    this.depotSubscription = this.depotDropdownService.getReloadObservable().subscribe(() => {
      console.log('Depot changed, regenerating chart');
      this.generateDiagramm();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotName'] && this.depotName) {
      console.log('Changed depotName:', this.depotName);
      this.generateDiagramm();
    }
  }

  ngOnDestroy() {
    // Unsubscribe from depot changes to avoid memory leaks
    if (this.depotSubscription) {
      this.depotSubscription.unsubscribe();
    }
  }*/

  generateDiagramm() {
    if (this.chart) {
      this.chart.destroy();  // Destroy the old chart first
    }

    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(response => {
      const wertpapiere = response.data;

      const data = Object.keys(wertpapiere).map(key => ({
        name: key,
        value: parseFloat(wertpapiere[key].WertpapierAnteil)
      }));

      const labels = data.map(wp => `${wp.name}: ${wp.value}`);

      const datasets = [{
        data: data.map(wp => wp.value),
        backgroundColor: data.map(() => this.getRandomColor()),
        borderColor: 'rgba(255, 255, 255, 1)',  // White border color
        borderWidth: 1
      }];

      const chartConfig: ChartConfiguration<'pie', number[], string> = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#DBD1D1',  // White text color
                font: {
                  family: 'Verdana, Geneva, Tahoma, sans-serif'
                }
              }
            },
            title: {
              display: true,
              text: 'Wertpapieranteil in Stück',
              color: 'white',  // White text color
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif',
                size: 15
              }
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem: any) {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value}`;
                }
              },
              titleFont: {
                family: 'Verdana, Geneva, Tahoma, sans-serif',
                size: 12
              },
              bodyFont: {
                family: 'Verdana, Geneva, Tahoma, sans-serif',
                size: 10
              }
            }
          }
        }
      };

      const canvas = document.getElementById('pieChartNumbers') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      } else {
        console.error('Canvas element not found');
      }
    });
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  }
}
