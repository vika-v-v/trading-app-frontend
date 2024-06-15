import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PasswordResetPageComponent } from './password-reset-page.component';
import { UserService } from '../services/user.service';

describe('PasswordResetPageComponent', () => {
  let component: PasswordResetPageComponent;
  let fixture: ComponentFixture<PasswordResetPageComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['resetPassword']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [], // Keine Komponenten hier deklarieren, da standalone: true verwendet wird
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetPageComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log error for empty email', () => {
    spyOn(console, 'error');

    component.email = '';

    component.sendLink();

    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Ungültige Eingaben!');
      expect(userService.resetPassword).not.toHaveBeenCalled();
    }, 100); // Adjust timing as needed
  });

  it('should reset password and navigate to login page on success', () => {
    const email = 'test@example.com';
    component.email = email;
    const response = { statusCode: 200 };

    userService.resetPassword.and.returnValue(of(response));
    spyOn(component, 'naviagateToLoginPage');

    component.sendLink();

    setTimeout(() => {
      expect(userService.resetPassword).toHaveBeenCalledWith(component['http'], email);

      // Hier sollte die URL angepasst werden, basierend auf der tatsächlichen URL in Ihrer Implementierung
      const req = httpMock.expectOne('expected-reset-url');
      expect(req.request.method).toBe('POST');

      // Simuliere eine erfolgreiche Antwort
      req.flush(response);

      expect(console.log).toHaveBeenCalledWith('Klappt!');
      expect(console.log).toHaveBeenCalledWith('Response:', response);
      expect(console.log).toHaveBeenCalledWith('Link gesendet!');
      expect(component.naviagateToLoginPage).toHaveBeenCalled();
    }, 100); // Adjust timing as needed
  });


  it('should log error on reset password failure', () => {
    const email = 'test@example.com';
    component.email = email;
    const errorMessage = 'Internal Server Error';

    userService.resetPassword.and.returnValue(throwError({ message: errorMessage }));
    spyOn(console, 'error');

    component.sendLink();

    setTimeout(() => {
      expect(userService.resetPassword).toHaveBeenCalledWith(component['http'], email);

      // Hier sollte die URL angepasst werden, basierend auf der tatsächlichen URL in Ihrer Implementierung
      const req = httpMock.expectOne('expected-reset-url');
      expect(req.request.method).toBe('POST');

      // Simuliere einen Fehler
      req.error(new ErrorEvent('Internal Server Error'));

      expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(ErrorEvent));
    }, 100); // Adjust timing as needed
  });
});
