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

  checkPasswordAndMatch() {
    this.checkPassword();
    this.checkPasswordMatch();
  }

  checkPassword() {
    this.passwordStrengthWidth = this.passwordUtils.checkPassword(this.password).width;
    this.passwordStrengthColor = this.passwordUtils.checkPassword(this.password).color;
    this.passwordStrengthText = this.passwordUtils.checkPassword(this.password).text;
    this.isPasswordInvalid = this.passwordUtils.checkPassword(this.password).isInvalid;
  }

  checkPasswordMatch() {
    this.doPasswordsMatch = this.passwordUtils.checkPasswordMatch(this.password, this.password2);
  }

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
          console.error('Error:', error);
          this.loadingShown = false;
        }
      );
    }
  }

  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  naviagateToHomePage() {
    this.router.navigate(['home-page']);
    this.autoLogoutService.startTimer();
  }
}
