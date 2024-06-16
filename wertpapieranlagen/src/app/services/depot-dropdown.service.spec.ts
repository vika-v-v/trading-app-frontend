import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient hier hinzugefügt

import { DepotDropdownService } from './depot-dropdown.service';
import { UserService } from './user.service';

describe('DepotDropdownService', () => {
  let service: DepotDropdownService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DepotDropdownService,
        UserService,
        { provide: 'ROOT_URL', useValue: 'https://example.com/api/' }
      ]
    });

    service = TestBed.inject(DepotDropdownService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get depot correctly', () => {
    const depotName = 'TestDepot';
    service.setDepot(depotName);
    expect(service.getDepot()).toEqual(depotName);
  });

  it('should fetch all depots', inject([HttpClient, HttpTestingController],
    (http: HttpClient, mock: HttpTestingController) => {
      const mockDepots = [
        { id: 1, name: 'Depot1' },
        { id: 2, name: 'Depot2' }
      ];

      service.getAllDepots(http)
        .subscribe(depots => {
          expect(depots.length).toBe(2);
          expect(depots).toEqual(mockDepots);
        });

      const req = mock.expectOne('https://example.com/api/depot/getAllDepots');
      expect(req.request.method).toBe('GET');

      req.flush(mockDepots);
    }));
});
