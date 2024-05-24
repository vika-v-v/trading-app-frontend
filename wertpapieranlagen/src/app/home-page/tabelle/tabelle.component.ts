import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabelle',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tabelle.component.html',
  styleUrl: './tabelle.component.css'
})
export class TabelleComponent implements AfterViewInit {
  @Input() tableHeader: string[] = [];
  @Input() tableData: any[] = [];

  ngAfterViewInit(): void {
      console.log('Table Header:', this.tableHeader);
      console.log('Table Data:', this.tableData);
  }
}
