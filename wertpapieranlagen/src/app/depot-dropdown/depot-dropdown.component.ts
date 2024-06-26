import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { UpdateEverythingService, Updateable } from '../services/update-everything.service'
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-depot-dropdown',
  templateUrl: './depot-dropdown.component.html',
  styleUrls: ['./depot-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent]
})
export class DepotDropdownComponent implements OnInit, Updateable { // OnDestroy,
  depots: string[] = [];
  filteredDepots: string[] = [];
  selectedDepot: string = '';
  errorMessage: string = '';
  searchTerm: string = '';
  //private reloadSubscription: Subscription;

  firstLoad: boolean = true;

  @Output() depotChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(private depotService: DepotDropdownService, private http: HttpClient, private cdr: ChangeDetectorRef, private updateEverythingService: UpdateEverythingService, private popupService: PopUpService) {
    updateEverythingService.subscribeToUpdates(this);
  }


  ngOnInit(): void {
    this.loadDepots();
  }

  update() {
    if(this.selectedDepot != this.depotService.getDepot()) {
      this.selectedDepot = this.depotService.getDepot();
    }
    this.loadDepots();
  }

  loadDepots() {
    this.depotService.getAllDepots(this.http).subscribe(
      (response) => {
        //this.depots = response.data; // Anpassen an das zurückgegebene Format
        let data = response.data;
        if(data.length > 0) {
          this.filteredDepots = data.map((depot: any) =>  depot.name);
          if(this.firstLoad) {

            this.setInitialDepot();
            this.updateEverythingService.updateAll();
          }
          this.firstLoad = false;
        }

        //if(!this.depotService.getDepot()) {
        //  this.setInitialDepot();
        //} else {
        //  this.selectedDepot = this.filteredDepots.find(depot => depot.label === this.depotService.getDepot());
        //}

        //this.cdr.detectChanges(); // Trigger change detection manually
      },
      (error) => {
        this.errorMessage = 'Fehler beim Abrufen der Depots: ' + error.message;
        //this.popupService.errorPopUp(this.errorMessage);
        //this.cdr.detectChanges(); // Trigger change detection manually
      }
    );
  }

  setInitialDepot() {
    if (this.filteredDepots.length > 0) {
      this.selectedDepot = this.filteredDepots[this.filteredDepots.length - 1];
      this.depotService.setDepot(this.selectedDepot);
    }
  }

  filterDepots() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepots = this.depots;
    } else {
      this.filteredDepots = this.depots.filter(depot =>
        depot.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }
  }

  onSelectDepot(depot: string) {
    if (depot) {
      this.selectedDepot = depot;
      this.depotService.setDepot(depot);
    }
  }
}
