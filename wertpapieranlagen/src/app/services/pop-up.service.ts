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

  private choiceResolver: ((value: boolean) => void) | null = null;

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

  choicePopUp(text: string): Promise<boolean> {
    this.anzeigenPopupSubject.next({ text, type: 'choice' });
    this.popUpVisibleSubject.next(true);
    return new Promise<boolean>((resolve) => {
      this.choiceResolver = resolve;
    });
  }

  resolveChoice(result: boolean) {
    if (this.choiceResolver) {
      this.choiceResolver(result);
      this.choiceResolver = null;
    }
    this.popUpVisibleSubject.next(false);
  }

  hidePopUp() {
    this.popUpVisibleSubject.next(false);
  }
}
