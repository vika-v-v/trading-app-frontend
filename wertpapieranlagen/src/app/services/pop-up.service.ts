import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private anzeigenPopupSubject = new BehaviorSubject<{ text: string, type: 'fehler' | 'info' | 'choice' }>({ text: '', type: 'fehler' });
  anzeigenPopup$ = this.anzeigenPopupSubject.asObservable();

  private popUpVisibleSubject = new BehaviorSubject<boolean>(false);
  popUpVisible$ = this.popUpVisibleSubject.asObservable();

  private choiceResponseSubject: Subject<boolean> = new Subject<boolean>();
  choiceResponse$ = this.choiceResponseSubject.asObservable();

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

  choicePopUp(text: string): Observable<boolean> {
    this.anzeigenPopupSubject.next({ text, type: 'choice' });
    this.popUpVisibleSubject.next(true);
    this.choiceResponseSubject = new Subject<boolean>(); // Re-initialize the subject
    return this.choiceResponseSubject.asObservable();
  }

  respondToChoice(response: boolean) {
    this.choiceResponseSubject.next(response);
    this.choiceResponseSubject.complete();
    this.popUpVisibleSubject.next(false);
  }

  hidePopUp() {
    this.popUpVisibleSubject.next(false);
  }
}
