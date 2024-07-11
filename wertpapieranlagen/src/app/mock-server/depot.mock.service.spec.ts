import { TestBed } from '@angular/core/testing';

import { DepotMockService } from './depot.mock.service';

describe('DepotMockService', () => {
  let service: DepotMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
