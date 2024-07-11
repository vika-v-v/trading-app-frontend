import { TestBed } from '@angular/core/testing';

import { WertpapierMockService } from './wertpapier.mock.service';

describe('WertpapierMockService', () => {
  let service: WertpapierMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WertpapierMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
