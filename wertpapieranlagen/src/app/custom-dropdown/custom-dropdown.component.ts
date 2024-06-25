import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

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
export class CustomDropdownComponent implements OnInit { // , OnChanges
  @Input() options: string[] = [];
  @Input() alwaysSelectOption: string | null = null;
  @Input() selectedOption: string | null = null;
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>();

  dropdownOpen: boolean = false;
  initalized: boolean = false;

  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeDropdown();
    //this.cdr.detectChanges(); // Force Angular to detect changes
  }

  /*
  ngOnChanges(changes: SimpleChanges): void {
    if(this.initalized && changes['selectedOption'] && this.selectedOption) {
      this.selectOption(this.selectedOption);
    }
  }*/

  private initializeDropdown() {
    if (this.alwaysSelectOption != null) {
      this.selectedOption = this.alwaysSelectOption;
    } else if (this.selectedOption == null) {
      this.selectedOption = "Wählen Sie eine Option aus...";
    }

    this.initalized = true;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string): void {
    if (this.alwaysSelectOption == null) {
      this.selectedOption = option;
    } else {
      this.selectedOption = this.alwaysSelectOption;
    }
    this.selectionChange.emit(option);
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (this.dropdown) {
      if (!this.dropdown.nativeElement.contains(targetElement)) {
        this.dropdownOpen = false;
      }
    }
  }
}
