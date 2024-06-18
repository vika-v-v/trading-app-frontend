import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class CustomDropdownComponent implements OnInit {
  @Input() options: { value: string, label: string }[] = [];
  @Input() alwaysSelectOption: string | null = null;
  @Input() selectFirstOptionOnStart: boolean = false;
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  selectedOption: { value: string, label: string } | null = null;
  dropdownOpen: boolean = false;

  constructor() {}

  ngOnInit() {
    this.initializeDropdown();
  }

  private initializeDropdown() {
    if (this.alwaysSelectOption != null) {
      this.selectedOption = { value: this.alwaysSelectOption, label: this.alwaysSelectOption };
    } else if (this.selectFirstOptionOnStart) {
      this.selectedOption = this.options[0] || { value: 'none', label: 'Wähle eine Option' };
    } else {
      this.selectedOption = { value: 'none', label: 'Wähle eine Option' };
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: { value: string, label: string }): void {
    if (this.alwaysSelectOption == null) {
      this.selectedOption = option;
    } else {
      this.selectedOption = { value: this.alwaysSelectOption, label: this.alwaysSelectOption };
    }
    this.selectionChange.emit(option.value);
    this.dropdownOpen = false;
  }
}
