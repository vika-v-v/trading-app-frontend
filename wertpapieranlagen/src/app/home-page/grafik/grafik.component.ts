import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { GrafikTyp } from './grafik-typ.enum';
import { HttpClient } from '@angular/common/http';
import { DepotService } from '../../services/depot.service';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Wertpapier {
  WertpapierDurchschnittspreis: string;
  WertpapierArt: string;
  WertpapierAnteil: string;
  Gesamtwert: string;
  WertpapierAktuellerKurs: string;
}

interface Wertpapiere {
  [key: string]: Wertpapier;
}

@Component({
  selector: 'app-grafik',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './grafik.component.html',
  styleUrls: ['./grafik.component.css']
})
export class GrafikComponent implements AfterViewInit {
  grafikTypEnum = GrafikTyp;
  grafikTypValues: string[];

  private chart: Chart<'pie' | 'bar' | 'line', number[], string> | undefined;
  typ : GrafikTyp = GrafikTyp.PizzadiagrammWertpapierarten;

  private BABY_BLUE =   {light: '#bcd8f6', dark: '#A2BEDC'};
  private NAVY_BLUE =   {light: '#133962', dark: '#042440'};
  private VIOLET_BLUE = {light: '#5d59b9', dark: '#4E499E'};
  private LAVENDER =    {light: '#ab90be', dark: '#B793C9'};
  private ROSE_PINK =   {light: '#e482b2', dark: '#D26B9D'};

  constructor(private depotService: DepotService, private http: HttpClient) {
    // Register Chart.js components
    Chart.register(...registerables);
    this.grafikTypValues = Object.values(this.grafikTypEnum);
  }

  ngAfterViewInit() {
    this.generateDiagramm();
  }

  generateDiagramm() {
    if (this.typ === GrafikTyp.PizzadiagrammWertpapierarten) {
      this.generatePizzaDiagramm();
    } else if (this.typ === GrafikTyp.WertverlaufWertpapierwerte) {
      this.generateLineChart();
    } else if (this.typ === 'LineChart') {
      this.generateBarDiagramm();
    }
  }

  generatePizzaDiagramm() {
    const wertpapierarten = this.getWertpapierarten();
    const labels = wertpapierarten.map(w => w.art);
    const data = wertpapierarten.map(w => w.percentage);

    const chartConfig: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            this.BABY_BLUE.light,
            this.LAVENDER.light,
            this.NAVY_BLUE.light,
            this.VIOLET_BLUE.light,
            this.ROSE_PINK.light
          ],
          borderColor: [
            this.BABY_BLUE.dark,
            this.LAVENDER.dark,
            this.NAVY_BLUE.dark,
            this.VIOLET_BLUE.dark,
            this.ROSE_PINK.dark
          ],
          borderWidth: 1
        }]
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
            text: 'Wertpapierarten',
            color: 'black',
            font: {
              family: 'Verdana, Geneva, Tahoma, sans-serif',
              size: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
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
  }

  generateBarDiagramm() {
    const wertpapierwerte = this.getWertpapierwerte();
    const labels = wertpapierwerte.map(w => w.name);
    const data = wertpapierwerte.map(w => w.value);

    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            this.BABY_BLUE.light,
            this.LAVENDER.light,
            this.NAVY_BLUE.light,
            this.VIOLET_BLUE.light,
            this.ROSE_PINK.light
          ],
          borderColor: [
            this.BABY_BLUE.dark,
            this.LAVENDER.dark,
            this.NAVY_BLUE.dark,
            this.VIOLET_BLUE.dark,
            this.ROSE_PINK.dark
          ],
          borderWidth: 1
        }]
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
            text: 'Wertpapierwerte',
            color: 'black',
            font: {
              family: 'Verdana, Geneva, Tahoma, sans-serif',
              size: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
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

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', chartConfig);
  }

  generateLineChart() {
    const xValues = ['01-24', '02-24', '03-24', '04-24', '05-24', '06-24', '07-24', '08-24', '09-24', '10-24', '11-24', '12-24'];
    const yValues = [1, 8, 8, 9, 23, 9, 10, 11, 14, 14, 15, 10];
    const yValues1 = [1, 18, 12, 19, 13, 19, 11, 14, 41, 43, 50, 12];
  
    const chartConfig = {
      type: 'line' as const, // Typ explizit als 'line' festlegen
      data: {
        labels: xValues,
        datasets: [{
          label: 'Apple',
          fill: false,
          tension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }, {
          label: 'Microsoft',
          fill: false,
          tension: 0,
          backgroundColor: "rgba(255,0,0,1.0)",
          borderColor: "rgba(255,0,0,0.1)",
          data: yValues1
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 55,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    };
  
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', chartConfig);
  }
  
  
  
  onChangeTyp(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value as GrafikTyp;
    this.typ = selectedValue; // Direkt zuweisen
    this.generateDiagramm();
  }
  
  getWertpapierarten() {
    const wertpapiere: Wertpapiere = this.depotService.getWertpapiere(this.http, "Name1").data;
    const wertpapierartenMap: { [key: string]: number } = {};

    // Calculate the total value (gesamtwert) and aggregate values by wertpapierart
    let gesamtwert = 0;
    for (const key in wertpapiere) {
      if (wertpapiere.hasOwnProperty(key)) {
        const wertpapier = wertpapiere[key];
        const wertpapierart = wertpapier.WertpapierArt;
        const aktuellerKurs = parseFloat(wertpapier.WertpapierAktuellerKurs);
        const anteil = parseFloat(wertpapier.WertpapierAnteil);

        const wert = aktuellerKurs * anteil;
        gesamtwert += wert;

        if (wertpapierartenMap[wertpapierart]) {
          wertpapierartenMap[wertpapierart] += wert;
        } else {
          wertpapierartenMap[wertpapierart] = wert;
        }
      }
    }

    // Calculate percentages
    return Object.keys(wertpapierartenMap).map(art => {
      return {
        art: art,
        percentage: Math.round((wertpapierartenMap[art] / gesamtwert) * 100)
      };
    });
  }

  getWertpapierwerte() {
    // Dummy data, replace with real data fetching
    return [
      { name: 'AAPL', value: 150 },
      { name: 'GOOGL', value: 200 },
      { name: 'MSFT', value: 100 },
      { name: 'TSLA', value: 250 },
      { name: 'AMZN', value: 300 }
    ];
  }
}
