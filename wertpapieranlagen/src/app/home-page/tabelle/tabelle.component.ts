import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FilterType } from './filter-type.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabelle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './tabelle.component.html',
  styleUrl: './tabelle.component.css'
})
export class TabelleComponent {
  FilterType = FilterType;

  @Input() tableHeader: any[] = [];
  @Input() tableData: any[] = [];

  tableDataFormatted: any[] = [];
  filterSortPopup: FilterType | null = null;

  popupPosition = { top: 0, left: 0 };
  currentIcon: HTMLElement | null = null;

  arrowUp: string = '../../../assets/icons/4829871_arrows_up_upload_icon.svg';
  arrowDown: string = '../../../assets/icons/4829873_arrow_down_download_icon.svg';

  @ViewChild('popup') popupRef!: ElementRef;
  @ViewChild('icon') iconRef!: ElementRef;

  possibleFiltersAndSortings = [
    {
      "FilterType" : FilterType.Date,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (früher bis später)",
          "ImageSrc" : this.arrowUp,
          "Selected" : false
        },
        {
          "Name" : "Absteigend sortieren (später bis früher)",
          "ImageSrc" : this.arrowDown,
          "Selected" : false
        }
      ],
      "Filters" : [
        {
          "Name" : "Zeitraum",
          "Typ" : "Dropdown",
          "Optionen" : ["Heute", "Gestern", "Diese Woche", "Dieser Monat", "Dieses Jahr", "Alle Perioden"],
          "Selected" : "Alle Perioden"
        }
      ]
    },
    {
      "FilterType" : FilterType.Text,
      "Sortings" : [
        {
          "Name" : "Aufsteigend sortieren (A-Z)",
          "ImageSrc" : this.arrowUp,
          "Selected" : false
        },
        {
          "Name" : "Absteigend sortieren (Z-A)",
          "ImageSrc" : this.arrowDown,
          "Selected" : false
        }
      ],
      "Filters" : [
        {
          "Name" : "Filtern nach...",
          "Typ" : "Textfeld",
          "Optionen" : [],
          "Selected" : ""
        }
      ]
    }
  ]

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
    console.log('Table Header:', this.tableHeader);
    console.log('Table Data:', this.tableData);

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
  }

  showFilterSortPopup(column: any, placeNear: HTMLElement) {
    this.filterSortPopup = column.typ;
    this.currentIcon = placeNear;

    const rect = placeNear.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    this.popupPosition.top = rect.top + scrollTop;
    this.popupPosition.left = rect.right + 5 + scrollLeft;
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

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}.${month}.${year}`;
  }
}
