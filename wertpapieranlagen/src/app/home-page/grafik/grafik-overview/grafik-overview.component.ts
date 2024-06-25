import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GrafikLinechartDepotComponent } from '../grafik-linechart-depot/grafik-linechart-depot.component';
import { GrafikLinechartWertpapierComponent } from '../grafik-linechart-wertpapier/grafik-linechart-wertpapier.component';
import { GrafikPiechartNumberComponent } from '../grafik-piechart-number/grafik-piechart-number.component';
import { GrafikPiechartValueComponent } from '../grafik-piechart-value/grafik-piechart-value.component';
import { CommonModule } from '@angular/common';
import { GrafikTyp } from '../grafik-typ.enum';
import { AktienDropdownComponent } from '../../../aktien-dropdown/aktien-dropdown.component';

@Component({
  selector: 'app-grafik-overview',
  templateUrl: './grafik-overview.component.html',
  styleUrls: ['./grafik-overview.component.css'],
  standalone: true,
  imports: [CommonModule, GrafikLinechartDepotComponent, GrafikPiechartNumberComponent, GrafikPiechartValueComponent, GrafikLinechartWertpapierComponent, AktienDropdownComponent]
})
export class GrafikOverviewComponent implements OnInit {
  grafikTyp = GrafikTyp;

  @Input() selectedDepotName: string | null = null;
  @Input() typ!: GrafikTyp;

  name = 'Grafik';

  constructor() {
  }

  ngOnInit(): void {
    if(this.typ == GrafikTyp.WertverlaufDepotwerte) {
      this.name = 'Depotverlauf';
    }
    else if(this.typ == GrafikTyp.PizzadiagrammWertpapierWert) {
      this.name = 'Gesamtwert der Wertpapiere';
    }
    else if(this.typ == GrafikTyp.PizzadiagrammWertpapierMenge) {
      this.name = 'Wertpapieranteil';
    }
    else if(this.typ == GrafikTyp.WertverlaufWertpapierWerte) {
      this.name = 'Aktien-Wertverlauf';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDepotName'] && this.selectedDepotName && this.selectedDepotName != '') {
      console.log('Depotname: ' + this.selectedDepotName);
    }
  }
}
