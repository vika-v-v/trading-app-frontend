import { Component, Input } from '@angular/core';
import { WertpapierVorgang } from '../wertpapier-vorgang.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wertpapier-vorgang',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './wertpapier-vorgang.component.html',
  styleUrl: './wertpapier-vorgang.component.css'
})
export class WertpapierVorgangComponent {
  WertpapierVorgang = WertpapierVorgang;

  @Input() wertpapierVorgang: WertpapierVorgang = WertpapierVorgang.Kaufen;
}
