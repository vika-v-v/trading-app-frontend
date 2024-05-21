import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {

  constructor(private router: Router) {
  }

  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }

}
