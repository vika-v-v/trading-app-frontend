import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  //Variablen werden mit der PopUp-Komponente verbunden
  private anzeigenPopupSubject = new BehaviorSubject<{ text: string, type: 'fehler' | 'info' | 'choice' }>({ text: '', type: 'fehler' });
  anzeigenPopup$ = this.anzeigenPopupSubject.asObservable();

  private popUpVisibleSubject = new BehaviorSubject<boolean>(false);
  popUpVisible$ = this.popUpVisibleSubject.asObservable();

  private choiceResponseSubject: Subject<boolean> = new Subject<boolean>();
  choiceResponse$ = this.choiceResponseSubject.asObservable();

  constructor() { }

  //Aufrufen des Error-PopUps mit übergebenem Text
  errorPopUp(text: string) {
    this.anzeigenPopupSubject.next({ text, type: 'fehler' });
    this.popUpVisibleSubject.next(true);
    setTimeout(() => {
      this.popUpVisibleSubject.next(false);
    }, 3000);
  }

  //Aufrufen des Info-PopUps mit übergebenem Text
  infoPopUp(text: string) {
    this.anzeigenPopupSubject.next({ text, type: 'info' });
    this.popUpVisibleSubject.next(true);
    setTimeout(() => {
      this.popUpVisibleSubject.next(false);
    }, 3000);
  }

  //Aufrufen des Choice-PopUps mit übergebenem Text + Return true oder false
  choicePopUp(text: string): Observable<boolean> {
    this.anzeigenPopupSubject.next({ text, type: 'choice' });
    this.popUpVisibleSubject.next(true);
    this.choiceResponseSubject = new Subject<boolean>(); // Re-initialize the subject
    return this.choiceResponseSubject.asObservable();
  }

  //Wird aufgerufen, wenn Ja oder Nein im Coice-PopUp gedrück wurde
  respondToChoice(response: boolean) {
    this.choiceResponseSubject.next(response);
    this.choiceResponseSubject.complete();
    this.popUpVisibleSubject.next(false);
  }

  //PopUps unsichtbar machen
  hidePopUp() {
    this.popUpVisibleSubject.next(false);
  }
}
