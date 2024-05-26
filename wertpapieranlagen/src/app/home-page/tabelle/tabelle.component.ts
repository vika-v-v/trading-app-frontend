import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FilterType } from './filter-type.enum';
import { FormsModule } from '@angular/forms';
import { RangeSliderComponent } from './range-slider/range-slider.component';

@Component({
  selector: 'app-tabelle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RangeSliderComponent
  ],
  templateUrl: './tabelle.component.html',
  styleUrl: './tabelle.component.css'
})
export class TabelleComponent {
  FilterType = FilterType;

  @Input() tableHeader: any[] = [];
  @Input() tableData: any[] = [];

  tableDataFormatted: any[] = [];
  tableHeaderFormatted: any[] = [];
  initialTableDataFormatted: any[] = [];

  filterSortPopup: any | null = null;

  popupPosition = { top: 0, left: 0 };
  currentIcon: HTMLElement | null = null;
  // TODO: wenn zweites mal geklicked nicht mehr anzeigen

  @ViewChild('popup') popupRef!: ElementRef;

  possibleFiltersAndSortings = [
    {
      "FilterType" : FilterType.Date,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (früher bis später)",
          "Key" : "asc",
          "ImageSrc" : this.arrowUp
        },
        {
          "Name" : "Absteigend sortieren (später bis früher)",
          "Key" : "desc",
          "ImageSrc" : this.arrowDown
        }
      ],
      "Filters" : [
        {
          "Name" : "Zeitraum",
          "Typ" : "Dropdown",
          "Optionen" : ["Heute", "Gestern", "Diese Woche", "Dieser Monat", "Dieses Jahr", "Alle Perioden"],
          "DefaultSelected" : "Alle Perioden"
        }
      ]
    },
    {
      "FilterType" : FilterType.Text,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (A-Z)",
          "Key" : "asc",
          "ImageSrc" : this.arrowUp
        },
        {
          "Name" : "Absteigend sortieren (Z-A)",
          "Key" : "desc",
          "ImageSrc" : this.arrowDown
        }
      ],
      "Filters" : [
        {
          "Name" : "Filtern nach...",
          "Typ" : "Textfeld"
        }
      ]
    },
    {
      "FilterType" : FilterType.Number,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (klein bis groß)",
          "Key" : "asc",
          "ImageSrc" : this.arrowUp
        },
        {
          "Name" : "Absteigend sortieren (groß bis klein)",
          "Key" : "desc",
          "ImageSrc" : this.arrowDown
        }
      ],
      "Filters" : [
        {
          "Name" : "Reichweite auswählen",
          "Typ" : "Slider"
        }
      ]
    },
    {
      "FilterType" : FilterType.Decimal,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (klein bis groß)",
          "Key" : "asc",
          "ImageSrc" : this.arrowUp
        },
        {
          "Name" : "Absteigend sortieren (groß bis klein)",
          "Key" : "desc",
          "ImageSrc" : this.arrowDown
        }
      ],
      "Filters" : [
        {
          "Name" : "Reichweite auswählen",
          "Typ" : "Slider"
        }
      ]
    }
  ]

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {

    // form table header - map data from possibleFiltersAndSortings to include into tableHeaderFormatted
    for (let i = 0; i < this.tableHeader.length; i++) {
      let headerObject: any = {}; // Change to object

      headerObject.wert = this.tableHeader[i].wert;
      headerObject.typ = this.tableHeader[i].typ;

      for (let filterSorting of this.possibleFiltersAndSortings) {
        if (filterSorting.FilterType == this.tableHeader[i].typ) {
          let sortings = [];
          for (let sorting of filterSorting.Sortings) {
            let sortingObject: any = {}; // Initialize as an object
            sortingObject.name = sorting.Name;
            sortingObject.imagesrc = sorting.ImageSrc;
            sortingObject.selected = false;
            sortingObject.key = sorting.Key;

            sortings.push(sortingObject);
          }
          headerObject.sortings = sortings;

          let filters = [];
          for (let filter of filterSorting.Filters) {
            let filterObject: any = {}; // Initialize as an object
            filterObject.name = filter.Name;
            filterObject.typ = filter.Typ;

            if ('Optionen' in filter) filterObject.optionen = filter.Optionen;
            if ('DefaultSelected' in filter) filterObject.selected = filter.DefaultSelected;
            if (filter.Typ == 'Slider') {
              filterObject.min = Math.floor(Math.min(...this.tableData.map(row => row[i])));
              filterObject.value1 = filterObject.min;

              filterObject.max = Math.ceil(Math.max(...this.tableData.map(row => row[i])));
              filterObject.value2 = filterObject.max;

              if(filterObject.min == filterObject.max) {
                filterObject.typ = "none";
              }
            }

            filters.push(filterObject);
          }
          headerObject.filters = filters;
        }
      }
      this.tableHeaderFormatted.push(headerObject);
    }

    // form table data - map types to include into tableDataFormatted
    for (let j = 0; j < this.tableData.length; j++) {
      let row = [];
      for (let i = 0; i < this.tableHeader.length; i++) {
        let data: any = {};
        if (this.tableHeader[i].typ == FilterType.Date) {
          data.wert = this.formatDate(this.tableData[j][i]);
        }
        else if (this.tableHeader[i].typ == FilterType.Decimal) {
          data.wert = parseFloat(this.tableData[j][i]).toFixed(2);
        }
        else if(this.tableHeader[i].typ == FilterType.Text) {
          data.wert = this.tableData[j][i];
          data.highlightedRange = {start: -1, end: -1};
        }
        else {
          data.wert = this.tableData[j][i];
        }
        row.push(data);
      }
      this.tableDataFormatted.push({row, "shown": true});
    }

    this.initialTableDataFormatted = [...this.tableDataFormatted];
  }

  showFilterSortPopup(column: any, placeNear: HTMLElement) {
    this.filterSortPopup = column;
    this.currentIcon = placeNear;

    const rect = placeNear.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    // Default position to the right of the element
    let popupLeft = rect.left + scrollLeft;
    let popupTop = rect.bottom + 5 + scrollTop;

    // Check if the popup would be rendered outside the right edge of the screen
    setTimeout(() => {
      const popupWidth = this.popupRef.nativeElement.offsetWidth;
      const screenWidth = window.innerWidth;

      if (popupLeft + popupWidth > screenWidth) {
        // Render the popup to the left of the element
        popupLeft = rect.right - popupWidth + scrollLeft;
      }

      this.popupPosition.top = popupTop;
      this.popupPosition.left = popupLeft;
    }, 0);
  }

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

  toggleSorting(sorting: any, header: any) {
    if (!sorting.selected) {
      this.tableHeaderFormatted.forEach((h: any) => {
        if(h.sortings != undefined) {
          h.sortings.forEach((s: any) => {
            s.selected = false;
          });
        }
      });
      sorting.selected = true;
      this.sortingSelected(sorting, header);
    } else {
      sorting.selected = false;
      this.tableDataFormatted = [...this.initialTableDataFormatted];
    }
  }

  headerSelected(header: any): boolean {
    if(header.sortings == undefined) return false;

    for (let s of header.sortings) {
      if (s.selected) {
        return true;
      }
    }
    return false;
  }

  getFilterSortPopupOptions(): any {
    for (let filterSorting of this.tableHeaderFormatted) {
      if (filterSorting == this.filterSortPopup) {
        return filterSorting;
      }
    }
  }

  // TODO: several filters selected
  filterSelected(filter: any, header: any) {
    const columnIndex = this.tableHeaderFormatted.findIndex(h => h === header);
    if (columnIndex < 0) return;

    if(header.typ == FilterType.Date) {
      if(filter.selected == "Alle Perioden") {
        this.tableDataFormatted.forEach((line: any) => {
          line.shown = true;
        });
      }
      else if (filter.selected == "Heute") {
        this.tableDataFormatted.forEach((line: any) => {
          if(line.row[columnIndex].wert != this.formatDate(new Date().toISOString())) {
            line.shown = false;
          }
          else {
            line.shown = true;
          }
        });
      }
      else if (filter.selected == "Gestern") {
        this.tableDataFormatted.forEach((line: any) => {
          if(line.row[columnIndex].wert != this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString())) {
            line.shown = false;
          }
          else {
            line.shown = true;
          }
        });
      }
      else if (filter.selected == "Diese Woche") {
        this.filterByWeek(columnIndex);
      }
      else if (filter.selected == "Dieser Monat") {
        this.filterByMonth(columnIndex);
      }
      else if (filter.selected == "Dieses Jahr") {
        this.filterByYear(columnIndex);
      }
    }
    else if(header.typ == FilterType.Text) {
      this.tableDataFormatted.forEach((line: any) => {
        if(line.row[columnIndex].wert.toLowerCase().includes(filter.selected.toLowerCase())) {
          line.shown = true;
          line.row[columnIndex].highlightedRange = {start: line.row[columnIndex].wert.toLowerCase().indexOf(filter.selected.toLowerCase()), end: line.row[columnIndex].wert.toLowerCase().indexOf(filter.selected.toLowerCase()) + filter.selected.length};
        }
        else {
          line.shown = false;
          line.row[columnIndex].highlightedRange = {start: -1, end: -1};
        }
      });
    }
    else if(header.typ == FilterType.Number || header.typ == FilterType.Decimal) {
      this.tableDataFormatted.forEach((line: any) => {
        if(line.row[columnIndex].wert >= filter.value1 && line.row[columnIndex].wert <= filter.value2) {
          line.shown = true;
        }
        else {
          line.shown = false;
        }
      });
    }
  }

  private sortingSelected(sorting: any, header: any) {
    if (!sorting.selected) return;

    const columnIndex = this.tableHeaderFormatted.findIndex(h => h === header);
    if (columnIndex < 0) return;

    this.tableDataFormatted.sort((a, b) => {
      let valueA = a.row[columnIndex].wert;
      let valueB = b.row[columnIndex].wert;

      if (header.typ === FilterType.Date) {
        valueA = this.parseDate(valueA).getTime();
        valueB = this.parseDate(valueB).getTime();
      }
      else if (header.typ === FilterType.Text) {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      else if (header.typ === FilterType.Number) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }

      if (sorting.key === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}.${month}.${year}`;
  }

  private filterByWeek(lineNumber: number) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

      const currentWeek = this.getWeek(new Date());
      this.tableDataFormatted.forEach((line: any) => {
        const date = this.parseDate(line.row[lineNumber].wert);
        line.shown = this.getWeek(date) === currentWeek && date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
    }

    private filterByYear(lineNumber: number) {
      const currentYear = new Date().getFullYear();
      this.tableDataFormatted.forEach((line: any) => {
        const date = this.parseDate(line.row[lineNumber].wert);
        line.shown = date.getFullYear() === currentYear;
      });
    }

    private filterByMonth(lineNumber: number) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      this.tableDataFormatted.forEach((line: any) => {
        const date = this.parseDate(line.row[lineNumber].wert);
        line.shown = date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
    }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(part => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }

  private getWeek(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const day = dayOfWeek === 0 ? 7 : dayOfWeek; // Adjust for Sunday being 0 in JavaScript

    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + day) / 7);
  }
}
