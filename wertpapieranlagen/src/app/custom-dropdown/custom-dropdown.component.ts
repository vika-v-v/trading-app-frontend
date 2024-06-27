import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.css'
})
export class CustomDropdownComponent implements OnInit, AfterViewInit {
  @Input() options: string[] = [];

  // Angezeigte Option wird sich nicht ändern - hilfreich für Aktionesdropdowns wie Transaktionsauswahl
  @Input() alwaysSelectOption: string | null = null;

  @Input() selectedOption: string | null = null;
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>(); // Notifiziert über Änderungen der Auswahl

  dropdownOpen: boolean = false;

  // Optionen können etweder oben oder unten angezeigt werden, diese Variable bestimmt die Richtung
  upwards: boolean = false;

  @ViewChild('dropdown') dropdown!: ElementRef;

  ngOnInit() {
    this.initializeDropdown();
  }

  ngAfterViewInit() {
    this.setPosition();
  }

  // Hier wird selectedOption anhand von Input-Parametern initialisiert
  private initializeDropdown() {
    if (this.alwaysSelectOption != null) {
      this.selectedOption = this.alwaysSelectOption;
    }
    else if (this.selectedOption == null) {
      this.selectedOption = "Wählen Sie eine Option aus...";
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Ausgewählte Option wird ändern
  selectOption(option: string): void {
    if (this.alwaysSelectOption == null) {
      this.selectedOption = option;
    }
    else {
      this.selectedOption = this.alwaysSelectOption;
    }

    this.selectionChange.emit(option);
    this.dropdownOpen = false;
  }

  // Bestimmt ob Dropdown nach oben oder unten geöffnet wird
  private setPosition(): void {
    const dropdownRect = this.dropdown.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - dropdownRect.bottom;
    const neededSpace = 200;

    this.upwards = spaceBelow < neededSpace;
  }

  // Dropdown ausklappen, wenn außerhalb des Dropdowns geklickt wird
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (this.dropdown) {
      if (!this.dropdown.nativeElement.contains(targetElement)) {
        this.dropdownOpen = false;
      }
    }
  }

  // Dropdown-Position aktualisieren, wenn Fenstergröße geändert wird
  @HostListener('window:resize')
  onResize(): void {
    if (this.dropdownOpen) {
      this.setPosition();
    }
  }

}
