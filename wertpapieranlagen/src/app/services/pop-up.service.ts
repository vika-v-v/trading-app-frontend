import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private anzeigenPopupSubject = new BehaviorSubject<{ text: string, type: 'fehler' | 'info' | 'choice' }>({ text: '', type: 'fehler' });
  anzeigenPopup$ = this.anzeigenPopupSubject.asObservable();

  private popUpVisibleSubject = new BehaviorSubject<boolean>(false);
  popUpVisible$ = this.popUpVisibleSubject.asObservable();

  constructor() { }

  errorPopUp(text: string) {
    this.anzeigenPopupSubject.next({ text, type: 'fehler' });
    this.popUpVisibleSubject.next(true);
    setTimeout(() => {
      this.popUpVisibleSubject.next(false);
    }, 3000);
  }

  infoPopUp(text: string) {
    this.anzeigenPopupSubject.next({ text, type: 'info' });
    this.popUpVisibleSubject.next(true);
    setTimeout(() => {
      this.popUpVisibleSubject.next(false);
    }, 3000);
  }

  choicePopUp(text: string) {
    this.anzeigenPopupSubject.next({ text, type: 'choice' });
    this.popUpVisibleSubject.next(true);
  }

  hidePopUp() {
    this.popUpVisibleSubject.next(false);
  }
}
