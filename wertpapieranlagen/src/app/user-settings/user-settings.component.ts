import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaxSettingsComponent } from './tax-settings/tax-settings.component';
import { CommonModule } from '@angular/common';
import { ChangePasswordPageComponent } from './change-password-page/change-password-page.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    TaxSettingsComponent,
    ChangePasswordPageComponent
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  steuerrechnerShown = false;
  changePasswordShown = false;

  constructor(private router: Router) {
  }

  showSteuerrechner() {
    this.steuerrechnerShown = true;
    this.changePasswordShown = false;
  }

  hideSteuerrechner() {
    this.steuerrechnerShown = false;
  }

  showChangePassword() {
    this.changePasswordShown = true;
    this.steuerrechnerShown = false;
  }

  hideChangePassword() {
    this.changePasswordShown = false;
  }

  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }
}
