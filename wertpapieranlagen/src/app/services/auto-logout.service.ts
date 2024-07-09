import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService implements OnDestroy {
  private logoutTimer: any;
  private timeLeftMinutes!: number; // Variable zur Speicherung der verbleibenden Minuten
  private readonly inactivityTime = 30 * 60 * 1000; // 30 Minuten Inaktivitätszeit
  private countdownInterval: any;
  private timerStarted: boolean = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private userService: UserService,
    private popUpService: PopUpService
  ) {}

  //Timer wird gestartet (passiert bei Anmeldung und Registrierung)
  startTimer() {
    if (!this.timerStarted) {
      this.initializeInactivityTimer();
      this.timerStarted = true;
    }
  }

  //Timer wird gestoppt (passiert beim Logout)
  stop() {
    this.ngZone.run(() => {
      this.clearTimersAndEventListeners();
    });
    this.timerStarted = false;
  }

  //Sicherung, das immer nur ein Timer aktiv ist
  ngOnDestroy() {
    this.clearTimersAndEventListeners();
  }

  //Timer wird initialisiert
  private initializeInactivityTimer() {
    this.resetLogoutTimer();
    this.setupEventListeners();
  }

  //Timer wird zurückgesetzt
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
          if (this.timeLeftMinutes <= 0) {
            clearInterval(this.countdownInterval);
          }
        });
      }, 60000); // 60000 Millisekunden = 1 Minute
    });
  }

  //Eventlistener um den Timer zurückzusetzen, falls ein Input erfolgt
  private setupEventListeners() {
    const eventTarget = document; // Listen to events on the whole document
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      eventTarget.addEventListener(event, this.resetLogoutTimerBound);
    });
  }

  //Saubere Löschung bei Timerstopp
  private clearTimersAndEventListeners() {
    this.clearTimers();
    this.removeEventListeners();
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

  private removeEventListeners() {
    const eventTarget = document; // Remove listeners from the whole document
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      eventTarget.removeEventListener(event, this.resetLogoutTimerBound);
    });
  }

  private resetLogoutTimerBound = this.resetLogoutTimer.bind(this);

  //Wird aufgerufen, wenn der Timer bei 0 ist; Meldet den User automatisch ab und stoppt den Timer.
  private autologout() {
    this.stop();
    this.router.navigate(['login-seite']); // Navigation zur Anmeldeseite
    this.userService.setToken('');
    this.popUpService.infoPopUp('Sie wurden automatisch ausgeloggt.');
  }
}
