import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DepotService } from '../../../services/depot.service';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grafik-piechart-value',
  standalone: true,
  imports: [],
  templateUrl: './grafik-piechart-value.component.html',
  styleUrl: './grafik-piechart-value.component.css'
})
export class GrafikPiechartValueComponent implements OnInit, OnChanges {
  @Input() depotName: string | null = null;
  private chart: Chart<'pie', number[], string> | undefined;

  constructor(
    private depotService: DepotService,
    private http: HttpClient,
    private depotDropdownService: DepotDropdownService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    if (this.depotName) {
      this.generatePizzaDiagrammValue();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotName'] && this.depotName) {
      this.generatePizzaDiagrammValue();
    }
  }

  generatePizzaDiagrammValue() {
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(response => {
      const wertpapiere = response.data;

      const data = Object.keys(wertpapiere).map(key => ({
        name: key,
        value: parseFloat(wertpapiere[key].GesamtwertKaufpreis)
      }));

      const totalValue = data.reduce((sum, wp) => sum + wp.value, 0);

      const percentages = data.map(wp => ({
        name: wp.name,
        percentage: (wp.value / totalValue) * 100
      }));

      const labels = percentages.map(wp => `${wp.name}: ${wp.percentage.toFixed(2)}%`);

      const datasets = [{
        data: percentages.map(wp => wp.percentage),
        backgroundColor: data.map(() => this.getRandomColor()),
        borderColor: data.map(() => 'rgba(0, 0, 0, 1)'),
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
                color: 'black',
                font: {
                  family: 'Verdana, Geneva, Tahoma, sans-serif'
                }
              }
            },
            title: {
              display: true,
              text: 'Gesamtwert der Wertpapiere in % (Stück)',
              color: 'black',
              font: {
                family: 'Verdana, Geneva, Tahoma, sans-serif',
                size: 15
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  const label = tooltipItem.label || '';
                  const value = tooltipItem.raw || 0;
                  return `${label}: ${value.toFixed(2)}%`;
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

      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart('canvas', chartConfig);
    });
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  }
}
