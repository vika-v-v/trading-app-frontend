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
  depots: string[] = ['Depot']; // Initialize depots as an array of strings
  expanded = false;
  _showBackground: boolean | null = null;

  showBackground() {
    this._showBackground = true;
  }

  hideBackground() {
    this._showBackground = false;
  }

  constructor() {
    /* API-Endpoint: liste von Depots aufrufen */

  }

  depotAnlegen() {
    /* API-Endpoint: neues Depot anlegen */
    this.depots.push('Depot' + (this.depots.length + 1));
  }

  ngAfterViewInit(): void {
    this.fillCanvas();
  }

  fillCanvas(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#e5e5e5'; // Set the fill color to grey
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
      }
    }
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}
