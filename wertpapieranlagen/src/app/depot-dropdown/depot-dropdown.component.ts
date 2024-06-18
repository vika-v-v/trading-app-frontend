import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
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

  @Output() depotChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(private depotService: DepotDropdownService, private http: HttpClient, private cdr: ChangeDetectorRef) {
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
    this.depotService.getAllDepots(this.http).subscribe(
      (response) => {
        this.depots = response.data; // Anpassen an das zurückgegebene Format
        this.filteredDepots = this.depots.map(depot => ({ value: depot.depotId, label: depot.name }));
        if(this.depotService.getDepot() == '' || this.depotService.getDepot() == undefined) {
          this.depotService.setDepot(this.filteredDepots[0].label);
          this.depotChanged.emit(this.filteredDepots[0].label);
        }
        this.cdr.detectChanges(); // Trigger change detection manually
      },
      (error) => {
        this.errorMessage = 'Fehler beim Abrufen der Depots: ' + error.message;
        this.cdr.detectChanges(); // Trigger change detection manually
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
      this.depotChanged.emit(selectedDepot.name);
    }
  }
}
