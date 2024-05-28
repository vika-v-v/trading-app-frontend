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

  private chart: Chart<'pie', number[], string> | undefined;
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
              family: 'Verdana, Geneva, Tahoma, sans-serif', // Change tooltip title font family
              size: 12 // Change tooltip title font size
            },
            bodyFont: {
              family: 'Verdana, Geneva, Tahoma, sans-serif', // Change tooltip body font family
              size: 10 // Change tooltip body font size
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
}
