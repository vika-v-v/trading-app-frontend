import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationPageComponent } from './registration-page.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PasswordUtilsService } from '../services/password-utils.service';
import { AutoLogoutService } from '../services/auto-logout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let passwordUtils: jasmine.SpyObj<PasswordUtilsService>;
  let autoLogoutService: jasmine.SpyObj<AutoLogoutService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['register', 'setToken']);
    const passwordUtilsSpy = jasmine.createSpyObj('PasswordUtilsService', ['checkPassword', 'checkPasswordMatch']);
    const autoLogoutServiceSpy = jasmine.createSpyObj('AutoLogoutService', ['startTimer']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RegistrationPageComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: PasswordUtilsService, useValue: passwordUtilsSpy },
        { provide: AutoLogoutService, useValue: autoLogoutServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    passwordUtils = TestBed.inject(PasswordUtilsService) as jasmine.SpyObj<PasswordUtilsService>;
    autoLogoutService = TestBed.inject(AutoLogoutService) as jasmine.SpyObj<AutoLogoutService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check password strength', () => {
    const passwordInfo = { width: '50%', color: 'green', text: 'Medium', isInvalid: false };
    passwordUtils.checkPassword.and.returnValue(passwordInfo);

    component.password = 'testPassword';
    component.checkPassword();

    expect(passwordUtils.checkPassword).toHaveBeenCalledWith('testPassword');
    expect(component.passwordStrengthWidth).toBe(passwordInfo.width);
    expect(component.passwordStrengthColor).toBe(passwordInfo.color);
    expect(component.passwordStrengthText).toBe(passwordInfo.text);
    expect(component.isPasswordInvalid).toBe(passwordInfo.isInvalid);
  });

  it('should check if passwords match', () => {
    passwordUtils.checkPasswordMatch.and.returnValue(true);

    component.password = 'password1';
    component.password2 = 'password1';
    component.checkPasswordMatch();

    expect(passwordUtils.checkPasswordMatch).toHaveBeenCalledWith('password1', 'password1');
    expect(component.doPasswordsMatch).toBe(true);
  });

  it('should not register with invalid inputs', () => {
    component.email = '';
    component.password = '';
    component.isPasswordInvalid = true;

    const consoleSpy = spyOn(console, 'log');
    component.registrieren();

    expect(consoleSpy).toHaveBeenCalledWith("Ungültige Eingaben!");
    expect(userService.register).not.toHaveBeenCalled();
  });

  it('should call UserService register on valid inputs', () => {
    component.email = 'test@example.com';
    component.password = 'validPassword';
    component.isPasswordInvalid = false;

    const registerResponse = { statusCode: 201, data: 'token' };
    userService.register.and.returnValue(of(registerResponse));

    const consoleSpy = spyOn(console, 'log');
    component.registrieren();

    expect(userService.register).toHaveBeenCalledWith(jasmine.any(Object), 'test@example.com', 'validPassword');
    expect(consoleSpy).toHaveBeenCalledWith('Response:', registerResponse);
    expect(userService.setToken).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['home-page']);
    expect(autoLogoutService.startTimer).toHaveBeenCalled();
  });

  it('should handle register error', () => {
    component.email = 'test@example.com';
    component.password = 'validPassword';
    component.isPasswordInvalid = false;

    const errorResponse = new Error('Test error');
    userService.register.and.returnValue(throwError(() => errorResponse));

    const consoleSpy = spyOn(console, 'error');
    component.registrieren();

    expect(consoleSpy).toHaveBeenCalledWith('Error:', errorResponse);
  });

  it('should navigate to login page', () => {
    component.naviagateToLoginPage();
    expect(router.navigate).toHaveBeenCalledWith(['login-seite']);
  });

  it('should navigate to home page', () => {
    component.naviagateToHomePage();
    expect(router.navigate).toHaveBeenCalledWith(['home-page']);
    expect(autoLogoutService.startTimer).toHaveBeenCalled();
  });
});
