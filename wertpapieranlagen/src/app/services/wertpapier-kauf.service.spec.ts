import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WertpapierKaufService } from './wertpapier-kauf.service';
import { UserService } from './user.service';

describe('WertpapierKaufService', () => {
  let service: WertpapierKaufService;
  let httpMock: HttpTestingController;
  const rootUrl = 'http://localhost:3000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WertpapierKaufService,
        UserService,
        { provide: 'ROOT_URL', useValue: rootUrl }
      ]
    });
    service = TestBed.inject(WertpapierKaufService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform Wertpapier Kauf', () => {
    const depotName = 'MeinDepot';
    const date = '2024-06-20';
    const wertpapiername = 'Aktie ABC';
    const anzahl = '10';
    const wertpapierPreis = '100';
    const transaktionskosten = '5';

    service.wertpapierkaufErfassen(depotName, date, wertpapiername, anzahl, wertpapierPreis, transaktionskosten).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response).toEqual({ success: true }); // Anpassen an die erwartete Antwort
    });

    const req = httpMock.expectOne(`${rootUrl}depot/addTransaction`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${TestBed.inject(UserService).getToken()}`);
    req.flush({ success: true }); // Simulierte Antwort
  });

  it('should perform Wertpapier Verkauf', () => {
    const depotName = 'MeinDepot';
    const date = '2024-06-20';
    const wertpapiername = 'Aktie ABC';
    const anzahl = '5';
    const wertpapierPreis = '110';
    const transaktionskosten = '3';

    service.wertpapierverkaufErfassen(depotName, date, wertpapiername, anzahl, wertpapierPreis, transaktionskosten).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response).toEqual({ success: true }); // Anpassen an die erwartete Antwort
    });

    const req = httpMock.expectOne(`${rootUrl}depot/addTransaction`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${TestBed.inject(UserService).getToken()}`);
    req.flush({ success: true }); // Simulierte Antwort
  });
});
