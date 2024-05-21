import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { LoginSeiteComponent } from './login-seite/login-seite.component'; // Importiere die Login-Seite Komponente
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    HttpClientModule, // Füge HttpClientModule hinzu
    LoginSeiteComponent // Füge die Login-Seite Komponente hinzu
  ],
  providers: []
})
export class AppModule { }
