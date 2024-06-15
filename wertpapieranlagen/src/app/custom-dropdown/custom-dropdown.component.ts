import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// !TODO if clicked on the arrow, also open the dropdown
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
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  selectedOption: { value: string, label: string } | null = null;
  dropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: { value: string, label: string }): void {
    this.selectedOption = option;
    this.selectionChange.emit(option.value);
    this.dropdownOpen = false;
  }
}
