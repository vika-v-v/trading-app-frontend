import { Component, OnInit } from '@angular/core';
import { GrafikLinechartDepotComponent } from '../grafik-linechart-depot/grafik-linechart-depot.component';
import { GrafikPiechartNumberComponent } from '../grafik-piechart-number/grafik-piechart-number.component';
import { GrafikPiechartValueComponent } from '../grafik-piechart-value/grafik-piechart-value.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafik-overview',
  templateUrl: './grafik-overview.component.html',
  styleUrls: ['./grafik-overview.component.css'],
  standalone: true,
  imports: [CommonModule, GrafikLinechartDepotComponent, GrafikPiechartNumberComponent, GrafikPiechartValueComponent]
})
export class GrafikOverviewComponent implements OnInit {
  selectedDepotName: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.selectedDepotName = 'MeinDepot'; // Beispiel Initialisierung, kann dynamisch gesetzt werden
  }
}
