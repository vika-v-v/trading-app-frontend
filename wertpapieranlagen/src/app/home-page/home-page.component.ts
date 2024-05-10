import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  /* API-Endpoint: liste von Depots {[Depot1, Depot2]}*/
  depots: string[] = []; // Initialize depots as an array of strings

  constructor() {
    /* API-Endpoint: liste von Depots aufrufen */

  }

  depotAnlegen() {
    /* API-Endpoint: neues Depot anlegen */
    this.depots.push('Depot' + (this.depots.length + 1));
  }
}
