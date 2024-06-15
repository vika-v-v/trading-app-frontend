import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.css'
})
export class CustomDropdownComponent {
  @Input() options: { value: string, label: string }[] = [];
  @Output() selectionChange: EventEmitter<Event> = new EventEmitter<Event>();

  onSelectionChange(event: Event): void {
    this.selectionChange.emit(event);
  }
}
