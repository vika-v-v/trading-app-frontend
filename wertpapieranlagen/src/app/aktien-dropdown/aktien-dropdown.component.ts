import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { DepotDropdownService } from '../services/depot-dropdown.service';

@Component({
  selector: 'app-aktien-dropdown',
  templateUrl: './aktien-dropdown.component.html',
  styleUrls: ['./aktien-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent]
})
export class AktienDropdownComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedDepot: string = '';
  aktien: string[] = [];
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();
  selectedAktie: string | null = null;

  constructor(private depotDropDownService: DepotDropdownService, private http: HttpClient) {}

  ngOnInit(): void {
    this.setDepot();
    this.loadAktien();
  }

  setDepot(){
    this.selectedDepot = this.depotDropDownService.getDepot();
  }

  update(): void {
    this.setDepot();
    this.loadAktien();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.setDepot();
    this.loadAktien();
  }

  loadAktien() {
    if (!this.selectedDepot) {
      this.aktien = ['Bitte Depot wählen!'];
      return;
    }

    this.subscription.add(
      this.depotDropDownService.getAktien(this.http, this.selectedDepot).subscribe(
        (response) => {
          this.aktien = ['Bitte Aktie wählen', ...response]; // Platzhalter hinzufügen
        },
        (error) => {
          this.errorMessage = 'Fehler beim Abrufen der Aktien: ' + error.message;
          console.error(this.errorMessage);
        }
      )
    );
  }

  onSelectAktie(aktie: string) {
    // Handle the selection of an aktie
    if (aktie === 'Bitte Aktie wählen') {
      this.selectedAktie = null;
    } else {
      this.selectedAktie = aktie;
      this.depotDropDownService.setAktie(aktie); // Aktualisiere den ausgewählten Aktiennamen im Service
    }
    console.log('Selected aktie:', aktie);
  }

  getAktie(): string | null {
    return this.selectedAktie;
  }
}
