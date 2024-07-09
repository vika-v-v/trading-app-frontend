import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { AutoLogoutService } from '../services/auto-logout.service';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-login-seite',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login-seite.component.html',
  styleUrl: './login-seite.component.css'
})
export class LoginSeiteComponent {
  //Variablen für Login
  email!: string;
  passwort!: string;

  constructor(private router: Router, private userService: UserService, private autoLogoutService: AutoLogoutService, private popUpService: PopUpService) {
  }

  //Funktion zum anmelden
  anmelden() {
    this.userService.login(this.email, this.passwort).subscribe(
      response => {
        if(response.statusCode == 200) {
          this.naviagateToHomePage();
          this.userService.setToken(response.data);
        } else {
          this.popUpService.errorPopUp("E-Mail oder Passwort falsch!")
        }
      },
      error => {
        if(error.error.statusCode == 404 || error.error.statusCode == 400) {
          this.popUpService.errorPopUp("E-Mail oder Passwort falsch!");
        }
        else {
          this.popUpService.errorPopUp("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
      }
    );
  }

  //Weiterleitung zur Startseite
  naviagateToHomePage() {
    this.router.navigate(['home-page']);
    this.autoLogoutService.startTimer();
  }

  //Weiterleitung zur Registrierung
  navigateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }

  //Weiterleitung zum Passwort zuücksetzen
  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }
}
