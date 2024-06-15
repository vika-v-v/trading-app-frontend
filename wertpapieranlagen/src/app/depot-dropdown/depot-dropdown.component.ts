import { Component, OnInit, OnDestroy } from '@angular/core';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importiere FormsModule
import { Subscription } from 'rxjs';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-depot-dropdown',
  templateUrl: './depot-dropdown.component.html',
  styleUrls: ['./depot-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent]
})
export class DepotDropdownComponent implements OnInit, OnDestroy {
  depots: any[] = [];
  filteredDepots: any[] = [];
  selectedDepot: any;
  errorMessage: string = '';
  searchTerm: string = '';
  private reloadSubscription: Subscription;

  constructor(private depotService: DepotDropdownService, private http: HttpClient) {
    this.reloadSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.loadDepots();
    this.reloadSubscription = this.depotService.getReloadObservable().subscribe(() => {
      this.loadDepots(); // Neu laden, wenn Benachrichtigung empfangen wird
    });
  }

  ngOnDestroy(): void {
    this.reloadSubscription.unsubscribe(); // Abonnements aufräumen
  }

  loadDepots() {
    this.filteredDepots = [{ value: '123', label: 'Keine Depots vorhanden' }, { value: '1234', label: 'Keine Depots vorhanden 2' }];
    this.depotService.getAllDepots(this.http).subscribe(
      (data) => {
        this.depots = data.data; // Anpassen an das zurückgegebene Format
        this.filteredDepots = this.depots; // Initialisiere filteredDepots mit allen Depots
        this.filteredDepots = this.depots.map(depot => ({ value: depot.depotId, label: depot.name }));
      },
      (error) => {
        this.errorMessage = 'Fehler beim Abrufen der Depots: ' + error.message;
      }
    );
  }

  filterDepots() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepots = this.depots;
    } else {
      this.filteredDepots = this.depots.filter(depot =>
        depot.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }
  }

  onSelectDepot(depotId: string) {
    if (depotId) {
      const selectedDepot = this.depots.find(depot => depot.depotId === depotId);
      this.selectedDepot = selectedDepot;
      this.depotService.setDepot(selectedDepot.name);
    }
  }
}
