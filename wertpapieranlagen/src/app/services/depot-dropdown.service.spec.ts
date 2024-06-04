import { TestBed } from '@angular/core/testing';

import { DepotDropdownService } from './depot-dropdown.service';

describe('DepotDropdownService', () => {
  let service: DepotDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
