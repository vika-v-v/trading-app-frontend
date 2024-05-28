import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PasswordUtilsService } from '../../services/password-utils.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './change-password-page.component.html',
  styleUrls: ['../../app.component.css', './change-password-page.component.css']
})
export class ChangePasswordPageComponent {
  password: string = '';
  password2: string = '';
  doPasswordsMatch: boolean = true;
  passwordStrengthText!: string;
  passwordStrengthWidth: string = '0%';
  passwordStrengthColor: string = '#ddd';
  isPasswordInvalid: boolean = false;

  constructor(private router: Router, private userService: UserService, private http: HttpClient, private passwordUtils: PasswordUtilsService) {}

  checkPassword() {
    this.passwordStrengthWidth = this.passwordUtils.checkPassword(this.password).width;
    this.passwordStrengthColor = this.passwordUtils.checkPassword(this.password).color;
    this.passwordStrengthText = this.passwordUtils.checkPassword(this.password).text;
    this.isPasswordInvalid = this.passwordUtils.checkPassword(this.password).isInvalid;
  }

  checkPasswordMatch() {
    this.doPasswordsMatch = this.passwordUtils.checkPasswordMatch(this.password, this.password2);
  }

  navigateToPasswordResetPage() {
    this.router.navigate(['password-reset-page']);
  }

  @Output() resetClicked = new EventEmitter<void>();
  onReset() {
    this.resetClicked.emit();
  }
}
