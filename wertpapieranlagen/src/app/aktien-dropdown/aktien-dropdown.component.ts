import { Component, OnInit, OnDestroy, Input, SimpleChanges, OnChanges } from '@angular/core';
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

  constructor(private depotService: DepotDropdownService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAktien();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.selectedDepot) {
      this.loadAktien();
    }
  }

  loadAktien() {
    if (!this.selectedDepot) {
      this.aktien = ['Bitte Depot wählen!'];
      return;
    }

    this.subscription.add(
      this.depotService.getAktien(this.http, this.selectedDepot).subscribe(
        (response) => {
          this.aktien = response; // Direktes Zuweisen der Aktiennamen
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
    console.log('Selected aktie:', aktie);
  }
}
