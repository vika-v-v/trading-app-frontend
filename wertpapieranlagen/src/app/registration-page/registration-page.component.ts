import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PasswordUtilsService } from '../services/password-utils.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AutoLogoutService } from '../services/auto-logout.service';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent {
  email: string = '';
  password: string = '';
  password2: string = '';
  doPasswordsMatch: boolean = true;
  passwordStrengthText!: string;
  passwordStrengthWidth: string = '0%';
  passwordStrengthColor: string = '#ddd';
  isPasswordInvalid: boolean = false;

  loadingShown: boolean = false;

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private passwordUtils: PasswordUtilsService, private autoLogoutService: AutoLogoutService, private popUpService: PopUpService) {}

  //Methode um 2 Prüfungen zusammen aufzurufen
  checkPasswordAndMatch() {
    this.checkPassword();
    this.checkPasswordMatch();
  }

  //Prüfung, ob das Passwort den nötigen Voraussetzungen entspricht + entsprechende Farben im Passwortstärke-Balken
  checkPassword() {
    this.passwordStrengthWidth = this.passwordUtils.checkPassword(this.password).width;
    this.passwordStrengthColor = this.passwordUtils.checkPassword(this.password).color;
    this.passwordStrengthText = this.passwordUtils.checkPassword(this.password).text;
    this.isPasswordInvalid = this.passwordUtils.checkPassword(this.password).isInvalid;
  }

  //Prüfung, ob die Passwörte gleich sind
  checkPasswordMatch() {
    this.doPasswordsMatch = this.passwordUtils.checkPasswordMatch(this.password, this.password2);
  }

  //Funktion zum Registrieren
  registrieren() {
    if(this.password == '' || this.isPasswordInvalid || !this.doPasswordsMatch || this.password2 == '' || this.email == '') {
      this.popUpService.errorPopUp("Ungültige Eingaben!");
    } else {
      this.loadingShown = true;

      this.userService.register(this.http, this.email, this.password).subscribe(
        response => {
          console.log('Response:', response);

          if(response.statusCode === 200 || response.statusCode === 201) {
            this.naviagateToHomePage();
            this.userService.setToken(response.data);
            this.popUpService.infoPopUp("Registrierung erfolgreich.");
          }
          this.loadingShown = false;
        },
        error => {
          this.popUpService.errorPopUp("Ein Fehler ist aufgetreten: " + error.error.message);
          this.loadingShown = false;
        }
      );
    }
  }

  //Weiterleitung zur Anmeldung
  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  //Weiterleitung zur Startseite
  naviagateToHomePage() {
    this.router.navigate(['home-page']);
    this.autoLogoutService.startTimer();
  }
}
