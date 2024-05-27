import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {

  email!: string;
  passwort1!: string;
  passwort2!: string;

  constructor(private router: Router, private userService: UserService, private http: HttpClient) {
  }

  registrieren(){

    this.userService.register(this.http, this.email, this.passwort1).subscribe(
      response => {
        console.log("Klappt!");
        console.log('Response:', response);

        if(response.statusCode === 200) {
          this.naviagateToHomePage();
        }
      },
      error => {
        console.error('Error:', error);
      }
    );

  }

  naviagateToLoginPage() {
    this.router.navigate(['login-seite']);
  }

  naviagateToHomePage() {
    this.router.navigate(['home-page']);
  }
}
