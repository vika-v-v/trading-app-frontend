import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-password-reset-page',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './password-reset-page.component.html',
  styleUrl: './password-reset-page.component.css'
})
export class PasswordResetPageComponent {
  //Variablen für den Reset-Link
  email: string = '';

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private popUpService: PopUpService) {
  }

  //Funktion zum senden des Links
  sendLink(){
    if(this.email === '') {
      this.popUpService.errorPopUp("Ungültige Eingaben!");
    } else {
      this.userService.resetPassword(this.http, this.email).subscribe(
        response => {
          console.log('Response:', response);

          if(response.statusCode === 200) {
            this.popUpService.infoPopUp("Link gesendet!")
            this.naviagateToLoginPage();
          }
        },
        error => {
          this.popUpService.errorPopUp("Nutzer konnte nicht gefunden werden!");
          console.error('Error:', error);
        }
      );
    }
  }

  //Weiterleitung zur Anmeldung
  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  //Weiterleitung zur Registrierung
  naviagateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }
}
