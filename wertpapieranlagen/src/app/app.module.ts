import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AutoLogoutService } from './services/auto-logout.service';
import { LoginSeiteComponent } from './login-seite/login-seite.component'; // Importiere die Login-Seite Komponente
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    LoginSeiteComponent
  ],
  providers: [AutoLogoutService]
})
export class AppModule { }
