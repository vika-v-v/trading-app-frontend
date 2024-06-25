import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service';
import { DepotService } from '../services/depot.service';


@Component({
  selector: 'app-aktien-dropdown',
  templateUrl: './aktien-dropdown.component.html',
  styleUrls: ['./aktien-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, CustomDropdownComponent]
})
export class AktienDropdownComponent implements OnInit, Updateable {
  aktien: string[] = [];
  selectedOption: string | null = null;

  @Input() selectedDepotName: string | null = null;

  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private http: HttpClient, private depotDropdownService: DepotDropdownService, private updateEverythingService: UpdateEverythingService, private depotService: DepotService) {
    this.updateEverythingService.subscribeToUpdates(this);
  }

  ngOnInit(): void {
    this.loadAktien();
  }

  update(){
    this.loadAktien();
  }

  loadAktien(): void {
    this.depotService.getWertpapiere(this.http, this.depotDropdownService.getDepot()).subscribe(
      (response) => {
        this.aktien = Object.keys(response.data);
        if(!this.selectedOption || !this.aktien.includes(this.selectedOption)){
          this.selectedOption = this.aktien[0];
            this.selectionChange.emit(this.selectedOption);
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Aktien:', error);
      }
    );
  }

  onSelectAktie(aktie: string): void {
    if(aktie != this.selectedOption){
      this.selectionChange.emit(aktie);
    }
    this.selectedOption = aktie;
    console.log('Ausgewählte Aktie:', aktie);
  }
}
