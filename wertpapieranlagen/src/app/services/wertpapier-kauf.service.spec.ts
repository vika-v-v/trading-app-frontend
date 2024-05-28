import { TestBed } from '@angular/core/testing';

import { WertpapierKaufService } from './wertpapier-kauf.service';

describe('WertpapierKaufService', () => {
  let service: WertpapierKaufService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WertpapierKaufService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
