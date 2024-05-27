import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  email!: string;

  constructor(private router: Router, private userService: UserService, private http: HttpClient) {
  }

  sendLink(){

    this.userService.reset(this.http, this.email).subscribe(
      response => {
        console.log("Klappt!");
        console.log('Response:', response);

        if(response.statusCode === 200) {
          console.log('Link gesendet!');
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

  naviagateToRegistrationPage() {
    this.router.navigate(['registration-page']);
  }
}
