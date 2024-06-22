import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-logged-in',
  standalone: true,
  imports: [],
  templateUrl: './not-logged-in.component.html',
  styleUrl: './not-logged-in.component.css'
})
export class NotLoggedInComponent {

  constructor(private router: Router) {}

  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  navigateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }
}
