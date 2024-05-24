import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-seite',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login-seite.component.html',
  styleUrl: './login-seite.component.css'
})
export class LoginSeiteComponent {

  email!: string;
  passwort!: string;

  constructor(private router: Router, private userService: UserService, private http: HttpClient) {
  }

  anmelden() {

    this.userService.login(this.http, this.email, this.passwort).subscribe(
      response => {
        console.log("Klappt!");
        console.log('Response:', response);

        this.naviagateToHomePage();
      },
      error => {
        console.error('Error:', error);
      }
    );

    this.naviagateToHomePage();
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
