import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private logoutTimer: any;
  private timeLeftMinutes!: number; // Änderung der Variable zur Speicherung der verbleibenden Minuten
  private readonly inactivityTime = 30 * 60 * 1000; // 30 Minuten Inaktivitätszeit
  private countdownInterval: any;
  private timerStarted: boolean = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private userService: UserService
  ) {}

  startTimer() {
    console.log('timer start');
    if (!this.timerStarted) {
      this.initializeInactivityTimer();
      this.timerStarted = true;
    }
  }

  stop() {
    console.log('timer stop');
    this.ngZone.run(() => {
      this.clearTimersAndEventListeners();
    });
    this.timerStarted = false;
  }

  private initializeInactivityTimer() {
    this.resetLogoutTimer();
    this.setupEventListeners();
  }

  private resetLogoutTimer() {
    this.clearTimers();
    this.timeLeftMinutes = this.inactivityTime / (1000 * 60); // Umrechnung in Minuten

    this.ngZone.runOutsideAngular(() => {
      this.logoutTimer = setTimeout(() => {
        this.ngZone.run(() => this.autologout());
      }, this.inactivityTime);

      this.countdownInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.timeLeftMinutes -= 1; // Reduziere um eine Minute
          console.log(`Time left until auto logout: ${this.timeLeftMinutes} minutes`);
          if (this.timeLeftMinutes <= 0) {
            clearInterval(this.countdownInterval);
          }
        });
      }, 60000); // 60000 Millisekunden = 1 Minute
    });
  }

  private setupEventListeners() {
    const eventTarget = document.getElementById('app-container'); // Change to your application's container element
    if (eventTarget) {
      ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        eventTarget.addEventListener(event, this.resetLogoutTimer.bind(this));
      });
    }
  }

  private clearTimersAndEventListeners() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private autologout() {
    this.router.navigate(['login-seite']); // Navigation zur Anmeldeseite
    this.userService.setToken('');
  }
}
