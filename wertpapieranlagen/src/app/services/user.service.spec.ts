import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const rootUrl = 'http://localhost:3000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: 'ROOT_URL', useValue: rootUrl }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get token', () => {
    service.setToken('test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should login user', () => {
    const email = 'test@example.com';
    const password = 'testpassword';
    const mockResponse = { statusCode: 200, data: { token: 'test-token' } };

    service.login( email, password).subscribe(response => {
      expect(response.statusCode).toBe(200);
      expect(response.data.token).toBe('test-token');
    });

    const req = httpMock.expectOne(`${rootUrl}users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X_API_KEY')).toBe('SP01Key');
    req.flush(mockResponse);
  });

  it('should register user', () => {
    const email = 'test@example.com';
    const password = 'testpassword';
    const mockResponse = { statusCode: 201, data: { token: 'test-token' } };

    service.register(email, password).subscribe(response => {
      expect(response.statusCode).toBe(201);
      expect(response.data.token).toBe('test-token');
    });

    const req = httpMock.expectOne(`${rootUrl}users/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X_API_KEY')).toBe('SP01Key');
    req.flush(mockResponse);
  });

  it('should reset password', () => {
    const email = 'test@example.com';
    const mockResponse = { statusCode: 200, message: 'Reset link sent successfully' };

    service.resetPassword(email).subscribe(response => {
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('Reset link sent successfully');
    });

    const req = httpMock.expectOne(`${rootUrl}users/reset-passwort-initialisieren`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X_API_KEY')).toBe('SP01Key');
    req.flush(mockResponse);
  });

  it('should update user data', () => {
    const optionalData = { email: 'new-email@example.com', vorname: 'Max', nachname: 'Mustermann' };
    const mockResponse = { statusCode: 200, message: 'User data updated successfully' };

    service.updateUserData(optionalData).subscribe(response => {
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('User data updated successfully');
    });

    const req = httpMock.expectOne(`${rootUrl}users/update`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${service.getToken()}`);
    req.flush(mockResponse);
  });
});
