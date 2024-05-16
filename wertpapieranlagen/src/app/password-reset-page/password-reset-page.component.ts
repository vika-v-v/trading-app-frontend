import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-page',
  standalone: true,
  imports: [],
  templateUrl: './password-reset-page.component.html',
  styleUrl: './password-reset-page.component.css'
})
export class PasswordResetPageComponent {

  constructor(private router: Router) {
  }

  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  naviagateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }
}
