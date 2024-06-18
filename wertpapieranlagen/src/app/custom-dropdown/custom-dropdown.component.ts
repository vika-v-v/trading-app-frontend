import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

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
export class CustomDropdownComponent implements AfterViewInit {
  @Input() options: { value: string, label: string }[] = [];
  @Input() alwaysSelectOption: string | null = null;
  @Input() selectFirstOptionOnStart: boolean = false;
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  selectedOption: { value: string, label: string } | null = null;
  dropdownOpen: boolean = false;

  ngAfterViewInit() {
    this.setAlwaysSelectedOption();
    if(this.selectFirstOptionOnStart) {
      this.selectedOption = this.options[0];
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: { value: string, label: string }): void {
    this.selectedOption = option;
    this.setAlwaysSelectedOption();
    this.selectionChange.emit(option.value);
    this.dropdownOpen = false;
  }

  setAlwaysSelectedOption() {
    if(this.alwaysSelectOption != null) {
      this.selectedOption = {value: this.alwaysSelectOption, label: this.alwaysSelectOption};
    }
  }
}
