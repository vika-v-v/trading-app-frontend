import { Component } from '@angular/core';

@Component({
  selector: 'app-depot-erstellen',
  standalone: true,
  imports: [],
  templateUrl: './depot-erstellen.component.html',
  styleUrl: './depot-erstellen.component.css'
})
export class DepotErstellenComponent {
  currentDate!: string;

  ngOnInit() {
    this.currentDate = this.formatDate(new Date());
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
