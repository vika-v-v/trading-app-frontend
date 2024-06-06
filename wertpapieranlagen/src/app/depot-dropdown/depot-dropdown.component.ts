import { Component, OnInit, Inject, Input } from '@angular/core';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importiere FormsModule

@Component({
  selector: 'app-depot-dropdown',
  templateUrl: './depot-dropdown.component.html',
  styleUrls: ['./depot-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DepotDropdownComponent implements OnInit {
  depots: any[] = [];
  filteredDepots: any[] = [];
  selectedDepot: any;
  errorMessage: string = '';
  searchTerm: string = '';


  constructor(private depotService: DepotDropdownService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDepots();
  }

  loadDepots() {
    this.depotService.getAllDepots(this.http).subscribe(
      (data) => {
        this.depots = data.data; // Anpassen an das zurückgegebene Format
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

  onSelectDepot(event: Event) {
    const target = event.target as HTMLSelectElement;
    const depotId = target.value;
    if (depotId) {
      const selectedDepot = this.depots.find(depot => depot.depotId === depotId);
      this.selectedDepot = selectedDepot;
      this.depotService.setDepot(selectedDepot.name);
    }
  }
}
