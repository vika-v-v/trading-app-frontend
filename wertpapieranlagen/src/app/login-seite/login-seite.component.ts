import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AutoLogoutService } from '../services/auto-logout.service';
import { PopUpService } from '../services/pop-up.service';

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

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private autoLogoutService: AutoLogoutService, private popUpService: PopUpService) {
  }

  anmelden() {

    this.userService.login(this.http, this.email, this.passwort).subscribe(
      response => {
        console.log("Klappt!");
        console.log('Response:', response);

        if(response.statusCode === 200) {
          this.naviagateToHomePage();
          this.userService.setToken(response.data);
        } else {
          this.popUpService.errorPopUp("E-Mail oder Passwort falsch!")
        }
      },
      error => {
        console.error('Error:', error);
        if(error.error.statusCode == 404 || error.error.statusCode == 400) {
          this.popUpService.errorPopUp("E-Mail oder Passwort falsch!");
        }
        else {
          this.popUpService.errorPopUp("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
      }
    );
  }

  naviagateToHomePage() {
    this.router.navigate(['home-page']);
    this.autoLogoutService.startTimer();
  }

  navigateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }

  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }
}
