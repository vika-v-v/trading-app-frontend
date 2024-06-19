import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

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
export class CustomDropdownComponent implements OnInit, OnChanges {
  @Input() options: { value: string, label: string }[] = [];
  @Input() alwaysSelectOption: string | null = null;
  @Input() selectedOption: { value: string, label: string } | null = null;
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  dropdownOpen: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeDropdown();
    this.cdr.detectChanges(); // Force Angular to detect changes
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedOption'] && this.selectedOption) {
      this.selectOption(this.selectedOption);
    }
  }

  private initializeDropdown() {
    if (this.alwaysSelectOption != null) {
      this.selectedOption = { value: this.alwaysSelectOption, label: this.alwaysSelectOption };
    } else if (this.selectedOption == null) {
      this.selectedOption = { value: "none", label: "Wählen Sie eine Option aus..." };
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
