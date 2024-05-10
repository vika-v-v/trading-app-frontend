import { Routes } from '@angular/router';
import { LoginSeiteComponent } from './login-seite/login-seite.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
  {path: 'login-seite', component: LoginSeiteComponent},
  {path: 'home-page', component: HomePageComponent}
];
