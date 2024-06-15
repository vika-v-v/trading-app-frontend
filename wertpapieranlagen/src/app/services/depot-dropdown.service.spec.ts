import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepotDropdownService } from './depot-dropdown.service';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

describe('DepotDropdownService', () => {
  let service: DepotDropdownService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  const rootUrl = 'http://localhost:3000/';

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DepotDropdownService,
        { provide: 'ROOT_URL', useValue: rootUrl },
        { provide: UserService, useValue: userServiceSpyObj }
      ]
    });

    service = TestBed.inject(DepotDropdownService);
    httpMock = TestBed.inject(HttpTestingController);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userServiceSpy.getToken.and.returnValue('test-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get depot', () => {
    service.setDepot('Test Depot');
    expect(service.getDepot()).toBe('Test Depot');
  });

  it('should fetch all depots', () => {
    const dummyDepots = {
      data: [
        { depotId: 1, name: 'Depot 1' },
        { depotId: 2, name: 'Depot 2' }
      ]
    };

    service.getAllDepots(TestBed.inject(HttpClient)).subscribe((depots) => {
      expect(depots.data.length).toBe(2);
      expect(depots.data).toEqual(dummyDepots.data);
    });

    const req = httpMock.expectOne(`${rootUrl}depot/getAllDepots`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(dummyDepots);
  });
});
