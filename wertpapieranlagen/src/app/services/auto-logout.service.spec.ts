import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { AutoLogoutService } from './auto-logout.service';
import { UserService } from './user.service';
import { PopUpService } from './pop-up.service';

describe('AutoLogoutService', () => {
  let service: AutoLogoutService;
  let router: jasmine.SpyObj<Router>;
  let userService: jasmine.SpyObj<UserService>;
  let popUpService: jasmine.SpyObj<PopUpService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['setToken']);
    const popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['infoPopUp']);

    TestBed.configureTestingModule({
      providers: [
        AutoLogoutService,
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: PopUpService, useValue: popUpServiceSpy },
      ]
    });

    service = TestBed.inject(AutoLogoutService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    popUpService = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start the timer', () => {
    const initializeInactivityTimerSpy = spyOn(service as any, 'initializeInactivityTimer');
    service.startTimer();
    expect(initializeInactivityTimerSpy).toHaveBeenCalled();
    expect(service['timerStarted']).toBe(true);
  });

  it('should not start the timer if already started', () => {
    service['timerStarted'] = true;
    const initializeInactivityTimerSpy = spyOn(service as any, 'initializeInactivityTimer');
    service.startTimer();
    expect(initializeInactivityTimerSpy).not.toHaveBeenCalled();
  });

  it('should stop the timer', fakeAsync(() => {
    const clearTimersAndEventListenersSpy = spyOn(service as any, 'clearTimersAndEventListeners');
    service.stop();
    tick();
    expect(clearTimersAndEventListenersSpy).toHaveBeenCalled();
    expect(service['timerStarted']).toBe(false);
  }));

  it('should call autologout and navigate to login-seite', fakeAsync(() => {
    const autologoutSpy = spyOn(service as any, 'autologout').and.callThrough();
    service.startTimer();
    tick(30 * 60 * 1000); // Simulate 30 minutes inactivity
    expect(autologoutSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['login-seite']);
    expect(userService.setToken).toHaveBeenCalledWith('');
    expect(popUpService.infoPopUp).toHaveBeenCalledWith('Sie wurden automatisch ausgeloggt.');
    flush(); // Ensure all remaining timers are flushed
  }));

  it('should clear timers and event listeners on stop', () => {
    const clearTimersSpy = spyOn(service as any, 'clearTimers');
    const removeEventListenersSpy = spyOn(service as any, 'removeEventListeners');
    service.stop();
    expect(clearTimersSpy).toHaveBeenCalled();
    expect(removeEventListenersSpy).toHaveBeenCalled();
  });

  it('should remove event listeners on destroy', () => {
    const clearTimersAndEventListenersSpy = spyOn(service as any, 'clearTimersAndEventListeners');
    service.ngOnDestroy();
    expect(clearTimersAndEventListenersSpy).toHaveBeenCalled();
  });
});
