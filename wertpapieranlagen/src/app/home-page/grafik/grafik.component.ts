import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { GrafikTyp } from './grafik-typ.enum';
import { HttpClient } from '@angular/common/http';
import { DepotService } from '../../services/depot.service';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

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
  imports: [],
  templateUrl: './grafik.component.html',
  styleUrls: ['./grafik.component.css']
})
export class GrafikComponent implements OnInit, AfterViewInit {
  @Input() typ: GrafikTyp = GrafikTyp.PizzadiagrammWertpapierarten;
  private chart: Chart<'pie', number[], string> | undefined;

  constructor(private depotService: DepotService, private http: HttpClient) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit() {
    // Removed chart creation from ngOnInit to ngAfterViewInit
  }

  ngAfterViewInit() {
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
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Wertpapierarten'
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
        percentage: (wertpapierartenMap[art] / gesamtwert) * 100
      };
    });
  }
}
