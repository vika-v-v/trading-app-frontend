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

  arrowUp: string = '../../../assets/icons/4829871_arrows_up_upload_icon.svg';
  arrowDown: string = '../../../assets/icons/4829873_arrow_down_download_icon.svg';

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
              filterObject.min = Math.min(...this.tableData.map(row => row[i]));
              filterObject.value1 = filterObject.min;

              filterObject.max = Math.max(...this.tableData.map(row => row[i]));
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
        if (this.tableHeader[i].typ == FilterType.Date) {
          row.push(this.formatDate(this.tableData[j][i]));
        }
        else {
          row.push(this.tableData[j][i]);
        }
      }
      this.tableDataFormatted.push(row);
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


  private sortingSelected(sorting: any, header: any) {
    if (!sorting.selected) return;

    const columnIndex = this.tableHeaderFormatted.findIndex(h => h === header);
    if (columnIndex < 0) return;

    this.tableDataFormatted.sort((a, b) => {
      let valueA = a[columnIndex];
      let valueB = b[columnIndex];

      if (header.typ === FilterType.Date) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
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

  onSliderChange(event: { value1: number, value2: number }, filterOption: any) {
    filterOption.selected = { min: event.value1, max: event.value2 };
  }


  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}.${month}.${year}`;
  }
}
