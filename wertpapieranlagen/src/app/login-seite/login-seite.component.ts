import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-seite',
  standalone: true,
  imports: [],
  templateUrl: './login-seite.component.html',
  styleUrl: './login-seite.component.css'
})
export class LoginSeiteComponent {

  constructor(private router: Router) {
  }

  naviagateToHomePage() {
    this.router.navigate(['home-page']);
  }

  navigateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }

  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }
}
