import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { GrafikTyp } from './grafik-typ.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DepotService } from '../../services/depot.service';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';
import { PopUpService } from '../../services/pop-up.service';

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

interface Data {
  [key: string]: {
    [key: string]: {
      GesamtwertKaufpreis: string;
      WertpapierDurchschnittspreis: string;
      WertpapierArt: string;
      WertpapierAnteil: string;
    }
  }
}

@Component({
  selector: 'app-grafik',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CustomDropdownComponent
  ],
  templateUrl: './grafik.component.html',
  styleUrls: ['./grafik.component.css']
})
export class GrafikComponent implements AfterViewInit {
  grafikTyp = GrafikTyp;
  grafikTypValues: string[];

  private chart: Chart<'pie' | 'bar' | 'line', number[], string> | undefined;
  @Input() typ: GrafikTyp = GrafikTyp.PizzadiagrammWertpapierMenge;
  name: string = '';

  wertpapiere: string[] = [];

  private BABY_BLUE = { light: '#bcd8f6', dark: '#A2BEDC' };
  private NAVY_BLUE = { light: '#133962', dark: '#042440' };
  private VIOLET_BLUE = { light: '#5d59b9', dark: '#4E499E' };
  private LAVENDER = { light: '#ab90be', dark: '#B793C9' };
  private ROSE_PINK = { light: '#e482b2', dark: '#D26B9D' };

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService, private popUpService: PopUpService) {
    // Register Chart.js components
    Chart.register(...registerables);
    this.grafikTypValues = Object.values(this.grafikTyp);
  }

  ngAfterViewInit() {
    this.generateDiagramm();
  }

  generateDiagramm() {
    if (this.typ === GrafikTyp.PizzadiagrammWertpapierWert) {
      this.generatePizzaDiagrammValue();
      this.name = 'Wertpapierwert';
    } else if (this.typ === GrafikTyp.WertverlaufWertpapierwerte) {
      this.generateLineChart();
      this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(
        response => {
          this.wertpapiere = response.data;
          this.popUpService.errorPopUp('Klappt');
        },
        error => {
          this.popUpService.errorPopUp('Fehler beim Abrufen der Wertpapiere.');
        });
      this.name = 'Wertpapierwert';
    } else if (this.typ === GrafikTyp.PizzadiagrammWertpapierMenge) {
      this.generatePizzaDiagrammNumber();
      this.name = 'Wertpapiermenge';
    } else if (this.typ === GrafikTyp.BardDiagrammWertpapiere) {
      this.generateBarDiagramm();
      this.name = 'Wertpapierarten';
    }
  }

  // Funktion generatePizzaDiagrammNumber
generatePizzaDiagrammNumber() {
  this.depotService.getWertpapiere(this.http, "Depot1").subscribe(response => {
    const wertpapiere = response.data;

    // Convert the data into an array of { name: string, value: number } objects
    const data = Object.keys(wertpapiere).map(key => ({
      name: key,
      value: parseFloat(wertpapiere[key].WertpapierAnteil)
    }));

    // Calculate total value
    const totalValue = data.reduce((sum, wp) => sum + wp.value, 0);

    // Calculate percentages
    const percentages = data.map(wp => ({
      name: wp.name,
      percentage: (wp.value / totalValue) * 100
    }));

    const labels = percentages.map(wp => `${wp.name}: ${wp.percentage.toFixed(2)}%`);

    const datasets = [{
      data: percentages.map(wp => wp.percentage),
      backgroundColor: data.map(() => this.getRandomColor()), // Zufällige Hintergrundfarben generieren
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
            text: 'Wertpapieranteil in % (Stück)',
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

// Funktion generatePizzaDiagrammValue
generatePizzaDiagrammValue() {
  this.depotService.getWertpapiere(this.http, "Depot1").subscribe(response => {
    const wertpapiere = response.data;

    // Convert the data into an array of { name: string, value: number } objects
    const data = Object.keys(wertpapiere).map(key => ({
      name: key,
      value: parseFloat(wertpapiere[key].GesamtwertKaufpreis)
    }));

    // Calculate total value
    const totalValue = data.reduce((sum, wp) => sum + wp.value, 0);

    // Calculate percentages
    const percentages = data.map(wp => ({
      name: wp.name,
      percentage: (wp.value / totalValue) * 100
    }));

    const labels = percentages.map(wp => `${wp.name}: ${wp.percentage.toFixed(2)}%`);

    const datasets = [{
      data: percentages.map(wp => wp.percentage),
      backgroundColor: data.map(() => this.getRandomColor()), // Zufällige Hintergrundfarben generieren
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

  generateBarDiagramm() {
    this.depotService.getWertpapiere(this.http, "Depot1").subscribe(response => {
      const wertpapiere: any = response.data;

      // Count occurrences of each WertpapierArt
      const countMap: { [key: string]: number } = {
        FOND: 0,
        AKTIE: 0,
        ETF: 0
      };

      Object.values(wertpapiere).forEach((wp: any) => { // <- Hier wp als any typisieren
        const art = wp.WertpapierArt.toUpperCase();
        if (countMap.hasOwnProperty(art)) {
          countMap[art]++;
        }
      });

      const labels = Object.keys(countMap);
      const data = labels.map(label => countMap[label]);

      const chartConfig: ChartConfiguration<'bar', number[], string> = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              this.BABY_BLUE.light,
              this.LAVENDER.light,
              this.NAVY_BLUE.light
            ],
            borderColor: [
              this.BABY_BLUE.dark,
              this.LAVENDER.dark,
              this.NAVY_BLUE.dark
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Anzahl Wertpapierarten',
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
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
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

  async generateLineChart() {
    try {
      const depotName = "Depot1";//this.depotDropdownService.getDepot();
      const input = await this.depotService.getWertverlauf(this.http, depotName).toPromise();
      const xValues: string[] = [];
      const yValues: { [key: string]: number[] } = {};
      const wertNameSet: Set<string> = new Set();
      const minMax: { [key: string]: { min: number, max: number } } = {};

      const data: Data = input.data;  // Cast to Data type

      for (const date in data) {
        xValues.push(date);
        for (const stockName in data[date]) {
          const stockData = data[date][stockName];
          const averagePrice = stockData.WertpapierDurchschnittspreis.replace(',', '.');
          const averagePriceNumber = parseFloat(averagePrice);

          if (!yValues[stockName]) {
            yValues[stockName] = [];
            wertNameSet.add(stockName);
            minMax[stockName] = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
          }
          yValues[stockName].push(averagePriceNumber);

          if (averagePriceNumber < minMax[stockName].min) minMax[stockName].min = averagePriceNumber;
          if (averagePriceNumber > minMax[stockName].max) minMax[stockName].max = averagePriceNumber;
        }
      }

      const datasets = [];
      let yAxisIndex = 0;

      for (const stockName of wertNameSet) {
        const stockData = yValues[stockName];
        datasets.push({
          label: stockName,
          fill: false,
          tension: 0,
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1.0)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.1)`,
          data: stockData,
          yAxisID: `y${yAxisIndex}`
        });
        yAxisIndex++;
      }

      const scales: any = {};

      let yIndex = 0;
      for (const stockName of wertNameSet) {
        const min = Math.floor(minMax[stockName].min * 0.9);
        const max = Math.ceil(minMax[stockName].max * 1.1);

        scales[`y${yIndex}`] = {
          type: 'linear',
          position: yIndex % 2 === 0 ? 'left' : 'right',
          min: min,
          max: max,
          ticks: {
            stepSize: 5
          },
          grid: {
            drawOnChartArea: yIndex % 2 === 0  // only want the grid lines for one axis to show up
          }
        };
        yIndex++;
      }

      const chartConfig: ChartConfiguration<'line', number[], string> = {
        type: 'line', // Typ explizit als 'line' festlegen
        data: {
          labels: xValues,
          datasets: datasets
        },
        options: {
          scales: scales
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart('canvas', chartConfig);
    } catch (error) {
      console.error('Fehler beim Abrufen des Wertverlaufs:', error);
    }
  }

  onChangeTyp(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value as GrafikTyp;
    this.typ = selectedValue; // Direkt zuweisen
    this.generateDiagramm();
  }

  // Hilfsfunktion für zufällige Farbgenerierung
getRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},0.8)`; // Alpha-Wert kann angepasst werden
}

  getWertpapierarten(wertpapiere: Wertpapiere) {
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
}
