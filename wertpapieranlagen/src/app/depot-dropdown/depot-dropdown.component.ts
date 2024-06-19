import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service'

@Component({
  selector: 'app-depot-dropdown',
  templateUrl: './depot-dropdown.component.html',
  styleUrls: ['./depot-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent]
})
export class DepotDropdownComponent implements OnInit, Updateable { // OnDestroy,
  depots: any[] = [];
  filteredDepots: any[] = [];
  selectedDepot: any;
  errorMessage: string = '';
  searchTerm: string = '';
  //private reloadSubscription: Subscription;

  @Output() depotChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(private depotService: DepotDropdownService, private http: HttpClient, private cdr: ChangeDetectorRef, private updateEverythingService: UpdateEverythingService) {
    //this.reloadSubscription = new Subscription();
    updateEverythingService.subscribeToUpdates(this);
  }

  ngOnInit(): void {
    this.loadDepots();
    //this.reloadSubscription = this.depotService.getReloadObservable().subscribe(() => {
    //  this.loadDepots(); // Neu laden, wenn Benachrichtigung empfangen wird
    //});
  }

  //ngOnDestroy(): void {
  //  this.reloadSubscription.unsubscribe(); // Abonnements aufräumen
  //}

  update() {
    this.loadDepots();
  }

  loadDepots() {
    this.depotService.getAllDepots(this.http).subscribe(
      (response) => {
        this.depots = response.data; // Anpassen an das zurückgegebene Format
        this.filteredDepots = this.depots.map(depot => ({ value: depot.depotId, label: depot.name }));

        if(!this.depotService.getDepot()) {
          this.setInitialDepot();
        } else {
          this.selectedDepot = this.filteredDepots.find(depot => depot.label === this.depotService.getDepot());
        }

        this.cdr.detectChanges(); // Trigger change detection manually
      },
      (error) => {
        this.errorMessage = 'Fehler beim Abrufen der Depots: ' + error.message;
        this.cdr.detectChanges(); // Trigger change detection manually
      }
    );
  }

  setInitialDepot() {
    if (this.filteredDepots.length > 0) {
      this.selectedDepot = this.filteredDepots[0];
      this.depotService.setDepot(this.selectedDepot.label);
      this.depotChanged.emit(this.selectedDepot.label);
    }
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
      this.depotChanged.emit(selectedDepot.name);
    }
  }
}
