import { TestBed } from '@angular/core/testing';

import { HttpclientProviderService } from './httpclient-provider.service';

describe('HttpclientProviderService', () => {
  let service: HttpclientProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpclientProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
