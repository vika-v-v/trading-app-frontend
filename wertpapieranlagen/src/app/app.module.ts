import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AutoLogoutService } from './services/auto-logout.service';
import { LoginSeiteComponent } from './login-seite/login-seite.component'; // Importiere die Login-Seite Komponente
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockInterceptor } from './mock-server/mock.interceptor';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    LoginSeiteComponent
  ]
})
export class AppModule { }
