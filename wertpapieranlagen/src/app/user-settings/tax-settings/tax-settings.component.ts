import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tax-settings',
  standalone: true,
  imports: [],
  templateUrl: './tax-settings.component.html',
  styleUrl: './tax-settings.component.css'
})
export class TaxSettingsComponent {
  @Output() resetClicked = new EventEmitter<void>();

  onReset() {
    this.resetClicked.emit();
  }
}
