import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSettingsComponent } from './user-settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';
import { AutoLogoutService } from '../services/auto-logout.service';
import { Component } from '@angular/core';

// Mock components for testing
@Component({
  selector: 'app-tax-settings',
  template: ''
})
class MockTaxSettingsComponent {}

@Component({
  selector: 'app-change-password-page',
  template: ''
})
class MockChangePasswordPageComponent {}

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockTaxSettingsComponent, // Mock of TaxSettingsComponent
        MockChangePasswordPageComponent // Mock of ChangePasswordPageComponent
      ],
      imports: [
        RouterTestingModule // For mocking the Router
      ],
      providers: [
        UserService,
        AutoLogoutService,
        { provide: 'ROOT_URL', useValue: 'http://example.com/api' } // Example of providing ROOT_URL
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show steuerrechner when showSteuerrechner is called', () => {
    component.showSteuerrechner();
    expect(component.steuerrechnerShown).toBe(true);
    expect(component.changePasswordShown).toBe(false);
  });

  it('should hide steuerrechner when hideSteuerrechner is called', () => {
    component.hideSteuerrechner();
    expect(component.steuerrechnerShown).toBe(false);
  });

  it('should show changePassword when showChangePassword is called', () => {
    component.showChangePassword();
    expect(component.changePasswordShown).toBe(true);
    expect(component.steuerrechnerShown).toBe(false);
  });

  it('should hide changePassword when hideChangePassword is called', () => {
    component.hideChangePassword();
    expect(component.changePasswordShown).toBe(false);
  });
});
