import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidePanel } from './side-panel.enum';
import { WertpapierVorgang } from './wertpapier-vorgang.enum';
import { WertpapierVorgangComponent } from './wertpapier-vorgang/wertpapier-vorgang.component';
import { DepotErstellenComponent } from './depot-erstellen/depot-erstellen.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { TaxSettingsComponent } from '../user-settings/tax-settings/tax-settings.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    WertpapierVorgangComponent,
    DepotErstellenComponent,
    UserSettingsComponent,
    TaxSettingsComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  SidePanel = SidePanel;
  WertpapierVorgang = WertpapierVorgang;

  /* API-Endpoint: liste von Depots {[Depot1, Depot2]}*/
  depots: string[] = ['Depot']; // Initialize depots as an array of strings
  expanded = false;
  _showSidePanel: boolean | null = null;
  sidePanel: SidePanel | null = null;

  showSidePanel(name: SidePanel) {
    this._showSidePanel = true;
    this.sidePanel = name;
  }

  hideSidePanel() {
    this._showSidePanel = false;
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
