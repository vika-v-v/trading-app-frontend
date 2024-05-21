import { Routes } from '@angular/router';
import { LoginSeiteComponent } from './login-seite/login-seite.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { PasswordResetPageComponent } from './password-reset-page/password-reset-page.component';

export const routes: Routes = [
  {path: 'login-seite', component: LoginSeiteComponent},
  {path: 'home-page', component: HomePageComponent},
  {path: 'registration-page', component: RegistrationPageComponent},
  {path: 'password-reset-page', component: PasswordResetPageComponent}
];
