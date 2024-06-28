import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FilterType } from './home-page/tabelle/filter-type.enum';

let arrowUp = '../../../assets/icons/phosphor-thin/arrow_up_thin_icon.svg';
let arrowDown = '../../../assets/icons/phosphor-thin/arrow_down_thin_icon.svg';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: "ROOT_URL",
      //useValue: "http://localhost:8080/api/"
      useValue: "http://213.133.101.113:8080/api/"
    },
    {
      provide: "SORTINGS_AND_FILTERS",
      useValue: [
        {
          "FilterType": FilterType.Date,
          "Sortings": [
            {
              "Name": "Aufsteigend sortieren (früher bis später)",
              "Key": "asc",
              "ImageSrc": arrowUp
            },
            {
              "Name": "Absteigend sortieren (später bis früher)",
              "Key": "desc",
              "ImageSrc": arrowDown
            }
          ],
          "Filters": [
            {
              "Name": "Zeitraum",
              "Typ": "Dropdown",
              "Optionen": ["Alle Perioden", "Heute", "Gestern", "Diese Woche", "Dieser Monat", "Dieses Jahr"],
              "DefaultSelected": "Alle Perioden"
            }
          ]
        },
        {
          "FilterType": FilterType.Text,
          "Sortings": [
            {
              "Name": "Aufsteigend sortieren (A-Z)",
              "Key": "asc",
              "ImageSrc": arrowUp
            },
            {
              "Name": "Absteigend sortieren (Z-A)",
              "Key": "desc",
              "ImageSrc": arrowDown
            }
          ],
          "Filters": [
            {
              "Name": "Filtern nach...",
              "Typ": "Textfeld"
            }
          ]
        },
        {
          "FilterType": FilterType.Number,
          "Sortings": [
            {
              "Name": "Aufsteigend sortieren (klein bis groß)",
              "Key": "asc",
              "ImageSrc": arrowUp
            },
            {
              "Name": "Absteigend sortieren (groß bis klein)",
              "Key": "desc",
              "ImageSrc": arrowDown
            }
          ],
          "Filters": [
            {
              "Name": "Reichweite auswählen",
              "Typ": "Slider"
            }
          ]
        },
        {
          "FilterType": FilterType.Decimal,
          "Sortings": [
            {
              "Name": "Aufsteigend sortieren (klein bis groß)",
              "Key": "asc",
              "ImageSrc": arrowUp
            },
            {
              "Name": "Absteigend sortieren (groß bis klein)",
              "Key": "desc",
              "ImageSrc": arrowDown
            }
          ],
          "Filters": [
            {
              "Name": "Reichweite auswählen",
              "Typ": "Slider"
            }
          ]
        },
        {
          "FilterType": FilterType.Object,
          "Sortings": [
            {
              "Name": "Aufsteigend sortieren (A-Z)",
              "Key": "asc",
              "ImageSrc": arrowUp
            },
            {
              "Name": "Absteigend sortieren (Z-A)",
              "Key": "desc",
              "ImageSrc": arrowDown
            }
          ],
          "Filters": [
            {
              "Name": "Anzeigen",
              "Typ": "Checkbox"
            }
          ]
        }
      ]
    }
  ]
};
