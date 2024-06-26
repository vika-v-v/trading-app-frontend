import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GrafikLinechartDepotComponent } from '../grafik-linechart-depot/grafik-linechart-depot.component';
import { GrafikLinechartWertpapierComponent } from '../grafik-linechart-wertpapier/grafik-linechart-wertpapier.component';
import { GrafikPiechartNumberComponent } from '../grafik-piechart-number/grafik-piechart-number.component';
import { GrafikPiechartValueComponent } from '../grafik-piechart-value/grafik-piechart-value.component';
import { CommonModule } from '@angular/common';
import { GrafikTyp } from '../grafik-typ.enum';
import { AktienDropdownComponent } from '../../../aktien-dropdown/aktien-dropdown.component';
import { DepotService } from '../../../services/depot.service';
import { UpdateEverythingService, Updateable } from '../../../services/update-everything.service';
import { HttpClient } from '@angular/common/http';
import { DepotDropdownService } from '../../../services/depot-dropdown.service';

@Component({
  selector: 'app-grafik-overview',
  templateUrl: './grafik-overview.component.html',
  styleUrls: ['./grafik-overview.component.css'],
  standalone: true,
  imports: [CommonModule, GrafikLinechartDepotComponent, GrafikPiechartNumberComponent, GrafikPiechartValueComponent, GrafikLinechartWertpapierComponent, AktienDropdownComponent]
})
export class GrafikOverviewComponent implements OnInit, Updateable {
  grafikTyp = GrafikTyp;
  wertpapierName!: string;


  @Input() selectedDepotName: string | null = null;
  @Input() typ!: GrafikTyp;

  @Input() selectedDepot: string | null = null;
  @Output() selectedAktieChange: EventEmitter<string> = new EventEmitter<string>();

  name = 'Grafik';

  wertpapiereVorhanden: boolean = true;

  constructor(private http: HttpClient, private depotService: DepotService, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService) {
    updateEverythingService.subscribeToUpdates(this);
  }

  update() {
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(
      response => {
        this.wertpapiereVorhanden = true;
      },
      error => {
        this.wertpapiereVorhanden = false;
      }
    );
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
    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDepotName'] && this.selectedDepotName && this.selectedDepotName != '') {
      console.log('Depotname: ' + this.selectedDepotName);
    }
  }

  wertpapierUpdate(aktie: string){
    this.wertpapierName = aktie;
  }

  handleAktieChange(aktie: string): void {
    this.selectedAktieChange.emit(aktie);
  }
}
