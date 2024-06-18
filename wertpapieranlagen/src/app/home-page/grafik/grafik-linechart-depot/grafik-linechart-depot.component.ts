import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grafik-linechart-depot',
  standalone: true,
  imports: [],
  templateUrl: './grafik-linechart-depot.component.html',
  styleUrl: './grafik-linechart-depot.component.css'
})
export class GrafikLinechartDepotComponent implements OnInit, OnChanges {
  @Input() depotName: string | null = null;
  private chart: Chart<'line', number[], string> | undefined;
  private getDepotName = this.depotDropdownService.getDepot();

  constructor(
    private depotService: DepotService,
    private http: HttpClient,
    private depotDropdownService: DepotDropdownService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    //if (this.depotName && this.depotName != '') {
    //  this.generateLineChart_DepotWert();
    //}
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotName'] && this.depotName && this.depotName != '') {
      this.generateLineChart_DepotWert();
    }
  }

  generateLineChart_DepotWert() {
    this.depotService.getDepot(this.http, this.getDepotName).subscribe(depotResponse => {
      this.generate(depotResponse);
    },
    error => {
      if(error.error.statusCode == 200) {
        this.generate(error.error);
      }
      console.error('Error while fetching depot data: ' + error);
    });
  }

  generate(depotResponse: any) {
    const depotData = depotResponse.data;
    const depotNames = Object.keys(depotData);

    const depotList = depotNames.map(depotName => ({
      depot: depotName,
      dates: depotData[depotName].Wertentwicklung.map((entry: any) => entry.Datum),
      values: depotData[depotName].Wertentwicklung.map((entry: any) => parseFloat(entry.Depotwert))
    }));

    const datasets = depotList.map(depot => ({
      label: depot.depot,
      data: depot.values,
      borderColor: this.getRandomColor(),
      fill: false
    }));

    const labels = depotList[0].dates;

    const chartConfig: ChartConfiguration<'line', number[], string> = {
      type: 'line',
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
              color: 'black',
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif'
              }
            }
          },
          title: {
            display: true,
            text: 'Depotwertentwicklung',
            color: 'black',
            font: {
              family: 'Verdana, Geneva, Tahoma, sans-serif',
              size: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                const label = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw || 0;
                return `${label}: ${value.toFixed(2)}`;
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
        },
        scales: {
          x: {
            ticks: {
              color: 'black',
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            ticks: {
              color: 'black',
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('lineChartDepotWertCanvas', chartConfig);
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  }
}
