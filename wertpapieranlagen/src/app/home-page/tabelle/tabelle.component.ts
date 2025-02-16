import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FilterType } from './filter-type.enum';
import { FormsModule } from '@angular/forms';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { CustomDropdownComponent } from '../../custom-dropdown/custom-dropdown.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tabelle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RangeSliderComponent,
    CustomDropdownComponent
  ],
  templateUrl: './tabelle.component.html',
  styleUrl: './tabelle.component.css'
})
export class TabelleComponent implements OnInit, OnChanges  {
  FilterType = FilterType;

  // Hier werden die Daten für die Tabelle übergeben
  @Input() tableHeader: any[] = [];
  @Input() tableData: any[] = [];
  @Input() name: string = '';
  @Input() leerFehlermeldung: string = 'Noch nicht vorhanden.';

  // Formatierte Eingabedaten, die u. a. angeben, ob eine Zeile angezeigt werden soll
  tableDataFormatted: any[] = [];
  tableHeaderFormatted: any[] = [];
  initialTableDataFormatted: any[] = [];

  // Informationen zu dem, welche Sortierungen und Filter ausgewählt sind
  filterSortPopup: any | null = null;

  popupPosition: any = {};
  currentIcon: HTMLElement | null = null; // wo filter zum letzten mal geöffnet wurde

  initialized = false;

  selectedDropdownOption: string = '';

  // größen Ansicht öffnen
  wideOpen: boolean = false;

  // Elemente, auf die aus der HTML-Schicht zugegriffen werden muss
  @ViewChild('popup') popupRef!: ElementRef;
  @ViewChild('table') table!: ElementRef;

  // Konfiguration Importieren
  constructor(@Inject('SORTINGS_AND_FILTERS') private possibleFiltersAndSortings: any) { }

  ngOnInit () {
    this.initializeData();
    this.initialized = true;
  }

  // Falls sich die Eingabedaten ändern, wird die Tabelle neu generiert
  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized && changes['tableData']) {
      this.tableDataFormatted = [];
      this.tableHeaderFormatted = [];
      this.initialTableDataFormatted = [];

      this.initializeData();
    }
  }

  // tableDataFormatted und tableHeaderFormatted initialisieren
  initializeData(): void {

    this.initHeaderData();
    this.initTableData();

    // für das Zurücksetzen der Filter und Sortierungen benötigt
    this.initialTableDataFormatted = [...this.tableDataFormatted];
  }

  // Positionierung des Popups beim Klicken anpassen
  showFilterSortPopup(column: any, placeNear: HTMLElement) {
    this.filterSortPopup = column;
    this.currentIcon = placeNear;

    const rect = placeNear.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Position rechts vom Icon
    let popupLeft = rect.left + scrollLeft;
    let popupTop = rect.bottom + 5 + scrollTop;

    // Warten bis Element gesitioniert ist, um overflow zu prüfen
    setTimeout(() => {
      const popupWidth = this.popupRef.nativeElement.offsetWidth;
      const popupHeight = this.popupRef.nativeElement.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Vertikale Position anpassen, wenn das Popup den Bildschirmrand überschreiten würde
      if (popupLeft + popupWidth > screenWidth) {
        popupLeft = rect.right - popupWidth + scrollLeft;
      }

      // Horizontale Position anpassen, wenn das Popup den Bildschirmrand überschreiten würde
      if (popupTop + popupHeight > screenHeight) {
        popupTop = rect.top - popupHeight + scrollTop;
      }

      this.popupPosition = { top: `${popupTop}px`, left: `${popupLeft}px` };
    }, 0);
  }

  // Filter beim auswählen anwenden
  filterSelected() {
    // Filter zurücksetzen
    this.tableDataFormatted.forEach((line: any) => {
      line.shown = true;
    });

    // Jeden Filter durchgehen und anwenden
    for (let i = 0; i < this.tableHeaderFormatted.length; i++) {
      let header = this.tableHeaderFormatted[i];
      header.filterUsed = false;

      for (let j = 0; j < header.filters.length; j++) {
        let filter = header.filters[j];

        // Entsprehene Methode für den Filter-Typ aufrufen
        if (header.typ == FilterType.Date) {
          this.filterTypeDateAnwenden(filter, header, i);
        }
        else if (header.typ == FilterType.Text) {
          this.filterTypeTextAnwenden(filter, i, header);
        }
        else if (header.typ == FilterType.Number || header.typ == FilterType.Decimal) {
          this.filterTypeNumberUndDecimalAnwenden(i, filter, header);
        }
        else if (header.typ == FilterType.Object) {
          this.filterTypeObjectAnwenden(filter, i, header);
        }
      }
    }
  }

  // Sortierung beim auswählen anwenden
  private sortingSelected(sorting: any, header: any) {

    // Eingabedaten prüfen

    if (!sorting.selected) return;

    const columnIndex = this.tableHeaderFormatted.findIndex(h => h === header);
    if (columnIndex < 0) return;

    // Sortierung anwenden
    this.tableDataFormatted.sort((a, b) => {
      let valueA = a.row[columnIndex].wert;
      let valueB = b.row[columnIndex].wert;

      // Für jeden Filtertyp separat Sortierwerte festlegen
      if (header.typ === FilterType.Date) {
        valueA = this.parseDate(valueA).getTime();
        valueB = this.parseDate(valueB).getTime();
      }
      else if (header.typ === FilterType.Text) {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      else if (header.typ === FilterType.Number || header.typ === FilterType.Decimal) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }

      // Sortierung anwenden
      if (sorting.key === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  // Sortierung umschalten, für die HTML-Element notwendig
  toggleSorting(sorting: any, header: any) {
    // Sortieung selektieren: alle Sortierungen zurücksetzen und die ausgewählte Sortierung selektieren
    if (!sorting.selected) {
      this.tableHeaderFormatted.forEach((h: any) => {
        if (h.sortings != undefined) {
          h.sortings.forEach((s: any) => {
            s.selected = false;
          });
        }
      });
      sorting.selected = true;
      this.sortingSelected(sorting, header);
    }
    // Sortierung deselektieren: alle Sortierungen zurücksetzen
    else {
      sorting.selected = false;
      this.tableDataFormatted = [...this.initialTableDataFormatted];
    }
  }

  // Beim Klicken außerhalb des Popups wird das Popup schließen
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (this.filterSortPopup && this.popupRef) {
      const clickedInsidePopup = this.popupRef.nativeElement.contains(targetElement);
      const clickedInsideIcon = this.currentIcon?.contains(targetElement);

      if (!clickedInsideIcon && !clickedInsidePopup) {
        this.filterSortPopup = null;
      }
    }
  }

  // über alle Informationen im Tabellenkontent durchegehen und je nach dem Typ benötigte Formatierungen hinzufügen
  private initTableData() {
    for (let j = 0; j < this.tableData.length; j++) {
      let row = [];
      for (let i = 0; i < this.tableHeader.length; i++) {
        let data: any = {};

        // Formatierungen hinzufügen
        if (this.tableHeader[i].typ == FilterType.Date) {
          data.wert = this.formatDate(this.tableData[j][i]);
        }
        else if (this.tableHeader[i].typ == FilterType.Decimal) {
          data.wert = parseFloat(this.tableData[j][i]).toFixed(2);
        }
        else if (this.tableHeader[i].typ == FilterType.Text) {
          data.wert = this.tableData[j][i];
          data.highlightedRange = { start: -1, end: -1 };
        }
        else { // keine Formatierung notwendig
          data.wert = this.tableData[j][i];
        }

        row.push(data);
      }
      // am Anfang alle Zeilen anzeigen
      this.tableDataFormatted.push({ row, "shown": true });
    }
  }

  // über alle Informationen im Header durchegehen und ersprechend Filter und Sortierungen dazu hinzufügen
  private initHeaderData() {
    for (let i = 0; i < this.tableHeader.length; i++) {
      let headerObject: any = {};

      headerObject.wert = this.tableHeader[i].wert;
      headerObject.typ = this.tableHeader[i].typ;

      for (let filterSorting of this.possibleFiltersAndSortings) {
        if (filterSorting.FilterType == this.tableHeader[i].typ) {

          // Sirtierungen hinzufügen
          let sortings = [];
          for (let sorting of filterSorting.Sortings) {
            let sortingObject: any = {};
            sortingObject.name = sorting.Name;
            sortingObject.imagesrc = sorting.ImageSrc;
            sortingObject.selected = false;
            sortingObject.key = sorting.Key;

            sortings.push(sortingObject);
          }
          headerObject.sortings = sortings;

          // Filter hinzufügen
          let filters = [];
          for (let filter of filterSorting.Filters) {
            let filterObject: any = {};
            filterObject.name = filter.Name;
            filterObject.typ = filter.Typ;
            filterObject.filterUsed = false;

            // Spezielle Parameter für bestimmte Filter hinzufügen
            if ('Optionen' in filter) filterObject.optionen = filter.Optionen;
            if ('DefaultSelected' in filter) filterObject.selected = filter.DefaultSelected;

            if (filter.Typ == 'Slider') this.initSliderParameters(filterObject, i);
            if (filter.Typ == 'Checkbox') this.initCheckboxParameters(i, filterObject);

            filters.push(filterObject);
          }
          headerObject.filters = filters;
        }
      }
      this.tableHeaderFormatted.push(headerObject);
    }
  }

  // image je nach dem ob Filter und/oder Sortierung angezeigt ist anpassen
  getArrowSrc(header: any) {
    const arrow = "../../../assets/icons/andere/box_arrow_down.svg";
    const arrowWithPoint = "../../../assets/icons/andere/box_arrow_down_with_point.svg";
    const arrowWithSort = "../../../assets/icons/andere/box_arrow_down_with_sort.svg";
    const arrowWithPointAndSort = "../../../assets/icons/andere/box_arrow_down_with_point_and_sort.svg";

    let filterUsed = false;
    let sortingUsed = false;

    // prüfen, welche Filter und Sortierungen ausgewählt sind
    if (header.filterUsed) filterUsed = true;

    for(let sorting of header.sortings) {
      if (sorting.selected) sortingUsed = true;
    }

    if(filterUsed && sortingUsed) return arrowWithPointAndSort;
    if(filterUsed) return arrowWithPoint;
    if(sortingUsed) return arrowWithSort;

    return arrow;
  }

  // gibt an, ob irgendwelche Filter oder Sortierungen angewendet sind um das Button "Änderungen löschen" anzuzeigen
  aenderungenLoeschenAngezeigt(): boolean {
    let angezeigt = false;

    this.tableHeaderFormatted.forEach((h: any) => {
      h.sortings.forEach((s: any) => {
        if(s.selected || h.filterUsed) {
          angezeigt = true;
          return;
        }
      });
    });

    return angezeigt;
  }

  // für das Button "Änderungen löschen" benötigt
  aenderungenLoeschen() {
    this.tableDataFormatted = [];
    this.tableHeaderFormatted = [];
    this.initialTableDataFormatted = [];
    this.initializeData();
  }

   // für die dynamische generierung des Popups in HTML benötigt
   getFilterSortPopupOptions(): any {
    for (let filterSorting of this.tableHeaderFormatted) {
      if (filterSorting == this.filterSortPopup) {
        this.selectedDropdownOption = filterSorting.filters[0].selected;
        return filterSorting;
      }
    }
  }

  // ------------------------
  // weitere Hilfsmethoden
  // ------------------------

  private initCheckboxParameters(i: number, filterObject: any) {
    let optionen = [];
    let uniqueValues = [...new Set(this.tableData.map(row => row[i]))];
    for (let value of uniqueValues) {
      optionen.push({ name: value, selected: true });
    }
    filterObject.optionen = optionen;
  }

  private initSliderParameters(filterObject: any, i: number) {
    filterObject.min = Math.floor(Math.min(...this.tableData.map(row => row[i])));
    filterObject.value1 = filterObject.min;

    filterObject.max = Math.ceil(Math.max(...this.tableData.map(row => row[i])));
    filterObject.value2 = filterObject.max;

    if (filterObject.min == filterObject.max) {
      filterObject.typ = "none";
    }
  }

  private filterTypeObjectAnwenden(filter: any, i: number, header: any) {
    this.tableDataFormatted.forEach((line: any) => {
      if (!(filter.optionen.find((option: any) => option.selected && option.name == line.row[i].wert))) {
        line.shown = false;
        header.filterUsed = true;
      }
    });
  }

  private filterTypeNumberUndDecimalAnwenden(i: number, filter: any, header: any) {
    this.tableDataFormatted.forEach((line: any) => {
      if (!(line.row[i].wert >= filter.value1 && line.row[i].wert <= filter.value2)) {
        line.shown = false;
        header.filterUsed = true;
      }
    });
  }

  private filterTypeTextAnwenden(filter: any, i: number, header: any) {
    this.tableDataFormatted.forEach((line: any) => {
      if (!filter.selected || !line.row[i].wert) {
        line.row[i].highlightedRange = { start: -1, end: -1 };
      }
      else if (line.row[i].wert.toLowerCase().includes(filter.selected.toLowerCase())) {
        line.row[i].highlightedRange = { start: line.row[i].wert.toLowerCase().indexOf(filter.selected.toLowerCase()), end: line.row[i].wert.toLowerCase().indexOf(filter.selected.toLowerCase()) + filter.selected.length };
      }
      else {
        line.shown = false;
        line.row[i].highlightedRange = { start: -1, end: -1 };
        header.filterUsed = true;
      }
    });
  }

  private filterTypeDateAnwenden(filter: any, header: any, i: number) {
    if (filter.selected == "Heute") {
      header.filterUsed = this.filterToday(i) ?? true;
    }
    else if (filter.selected == "Gestern") {
      header.filterUsed = this.filterYesterday(i) ?? true;
    }
    else if (filter.selected == "Diese Woche") {
      header.filterUsed = this.filterByWeek(i) ?? true;
    }
    else if (filter.selected == "Dieser Monat") {
      header.filterUsed = this.filterByMonth(i) ?? true;
    }
    else if (filter.selected == "Dieses Jahr") {
      header.filterUsed = this.filterByYear(i) ?? true;
    }
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}.${month}.${year}`;
  }

  private filterToday(lineNumber: number): boolean {
    let used = false;
    this.tableDataFormatted.forEach((line: any) => {
      if (line.row[lineNumber].wert != this.formatDate(new Date().toISOString())) {
        line.shown = false;
        used = true;
      }
    });
    return used;
  }

  private filterYesterday(lineNumber: number): boolean {
    let used = false;
    this.tableDataFormatted.forEach((line: any) => {
      if (line.row[lineNumber].wert != this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString())) {
        line.shown = false;
        used = true;
      }
    });
    return used;
  }

  private filterByWeek(lineNumber: number): boolean {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let used = false;

    const currentWeek = this.getWeek(new Date());
    this.tableDataFormatted.forEach((line: any) => {
      const date = this.parseDate(line.row[lineNumber].wert);
      if (!(this.getWeek(date) === currentWeek && date.getFullYear() === currentYear && date.getMonth() === currentMonth)) {
        line.shown = false;
        used = true;
      }
    });
    return used;
  }

  private filterByYear(lineNumber: number): boolean {
    const currentYear = new Date().getFullYear();
    let used = false;
    this.tableDataFormatted.forEach((line: any) => {
      const date = this.parseDate(line.row[lineNumber].wert);
      if (!(date.getFullYear() === currentYear)) {
        line.shown = false;
        used = true;
      }
    });
    return used;
  }

  private filterByMonth(lineNumber: number): boolean {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let used = false;

    this.tableDataFormatted.forEach((line: any) => {
      const date = this.parseDate(line.row[lineNumber].wert);
      if (!(date.getFullYear() === currentYear && date.getMonth() === currentMonth)) {
        line.shown = false;
        used = true;
      }
    });
    return used;
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(part => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }

  private getWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7; // ISO week starts on Monday
    target.setDate(target.getDate() - dayNr + 3); // Thursday
    const firstThursday = new Date(target.getFullYear(), 0, 4);

    // Calculate the number of days between the target date and the first Thursday of the year
    const daysBetween = Math.floor((target.getTime() - firstThursday.getTime()) / 86400000);
    const weekNumber = Math.round((daysBetween + firstThursday.getDay() + 1) / 7);

    return weekNumber;
  }
}
