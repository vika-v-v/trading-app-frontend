import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginSeiteComponent } from './login-seite.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AutoLogoutService } from '../services/auto-logout.service';
import { PopUpService } from '../services/pop-up.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginSeiteComponent', () => {
  let component: LoginSeiteComponent;
  let fixture: ComponentFixture<LoginSeiteComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let autoLogoutService: jasmine.SpyObj<AutoLogoutService>;
  let popUpService: jasmine.SpyObj<PopUpService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const autoLogoutServiceSpy = jasmine.createSpyObj('AutoLogoutService', ['startTimer']);
    const popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['errorPopUp']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, LoginSeiteComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AutoLogoutService, useValue: autoLogoutServiceSpy },
        { provide: PopUpService, useValue: popUpServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginSeiteComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    autoLogoutService = TestBed.inject(AutoLogoutService) as jasmine.SpyObj<AutoLogoutService>;
    popUpService = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call UserService login on anmelden', () => {
    component.email = 'test@example.com';
    component.passwort = 'password';
    const loginResponse = { statusCode: 200, data: 'token' };
    userService.login.and.returnValue(of(loginResponse));

    component.anmelden();

    expect(userService.login).toHaveBeenCalledWith(jasmine.any(Object), 'test@example.com', 'password');
  });

  it('should navigate to home page and start timer on successful login', () => {
    component.email = 'test@example.com';
    component.passwort = 'password';
    const loginResponse = { statusCode: 200, data: 'token' };
    userService.login.and.returnValue(of(loginResponse));

    component.anmelden();

    expect(router.navigate).toHaveBeenCalledWith(['home-page']);
    expect(autoLogoutService.startTimer).toHaveBeenCalled();
    expect(userService.setToken).toHaveBeenCalledWith('token');
  });

  it('should show error popup on failed login', () => {
    component.email = 'test@example.com';
    component.passwort = 'password';
    const loginResponse = { statusCode: 401, data: null };
    userService.login.and.returnValue(of(loginResponse));

    component.anmelden();

    expect(popUpService.errorPopUp).toHaveBeenCalledWith('E-Mail oder Passwort falsch!');
  });


  it('should navigate to registration page', () => {
    component.navigateToRegistrationPage();
    expect(router.navigate).toHaveBeenCalledWith(['registration-page']);
  });

  it('should navigate to password reset page', () => {
    component.navigateToPasswordResetPage();
    expect(router.navigate).toHaveBeenCalledWith(['password-reset-page']);
  });
});
