import { FilterType } from "./filter-type.enum";

export class Filter {
  filtertype: FilterType;
  value: any;

  constructor(filtertype: FilterType, value: any) {
    this.filtertype = filtertype;
    this.value = value;
  }
}
