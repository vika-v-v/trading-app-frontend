import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { GrafikTyp } from './grafik-typ.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import für HttpHeaders hinzugefügt
import { DepotService } from '../../services/depot.service';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
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
      CommonModule
    ],
    templateUrl: './grafik.component.html',
    styleUrls: ['./grafik.component.css']
  })

export class GrafikComponent implements AfterViewInit {
  grafikTypEnum = GrafikTyp;
  grafikTypValues: string[];

  private chart: Chart<'pie' | 'bar' | 'line', number[], string> | undefined;
  typ: GrafikTyp = GrafikTyp.PizzadiagrammWertpapierarten;

  private BABY_BLUE = { light: '#bcd8f6', dark: '#A2BEDC' };
  private NAVY_BLUE = { light: '#133962', dark: '#042440' };
  private VIOLET_BLUE = { light: '#5d59b9', dark: '#4E499E' };
  private LAVENDER = { light: '#ab90be', dark: '#B793C9' };
  private ROSE_PINK = { light: '#e482b2', dark: '#D26B9D' };

  constructor(private depotService: DepotService, private http: HttpClient, private depotDropdownService: DepotDropdownService) {
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
    } else if (this.typ === GrafikTyp.BardDiagrammWertpapiere) {
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

  async generateLineChart() {
    try {
      const depotName = this.depotDropdownService.getDepot();
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