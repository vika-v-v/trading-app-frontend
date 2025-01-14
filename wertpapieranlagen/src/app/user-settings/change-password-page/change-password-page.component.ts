import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PasswordUtilsService } from '../../services/password-utils.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.css']
})
export class ChangePasswordPageComponent {
  password: string = '';
  password2: string = '';
  doPasswordsMatch: boolean = true;
  passwordStrengthText!: string;
  passwordStrengthWidth: string = '0%';
  passwordStrengthColor: string = '#ddd';
  isPasswordInvalid: boolean = false;

  constructor(private router: Router, private userService: UserService, private passwordUtils: PasswordUtilsService, private popUpService: PopUpService) {}

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

  //Weiterleitung zum Passwort zurücksetzen
  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }

  //Notwendig, um beim Abbruch das Fenster zu schließen
  @Output() resetClicked = new EventEmitter<void>();
  onReset() {
    this.resetClicked.emit();
  }

  //Funktion zum senden des Links
  changePassword() {
    if(this.password == '' || this.isPasswordInvalid || !this.doPasswordsMatch || this.password2 == '') {
      this.popUpService.errorPopUp("Ungültige Eingaben!");
    } else {
      this.userService.updateUserData({password: this.password}).subscribe(
        response => {

          if(response.statusCode === 200) {
            this.popUpService.infoPopUp("Passwort erfolgreich geändert.");
          }
        }
      );
    }
  }
}
