import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnDestroy {
  text!: string;
  symbol!: string;
  popupColor!: string;
  choicePopUpVisible: boolean = false;
  private popupSubscription: Subscription;

  //Konstruktor
  constructor(private popUpService: PopUpService) {
    //Stellt eine Verbindung zum PopUpService her
    this.popupSubscription = this.popUpService.anzeigenPopup$.subscribe(({ text, type }) => {
      if (type === 'fehler') {
        this.errorPopUp(text);
      } else if (type === 'info') {
        this.infoPopUp(text);
      } else if (type === 'choice') {
        this.choicePopUp(text);
      }
    });
  }

  //Best-Practice; Wenn Subscription aufgelöst werden soll
  ngOnDestroy(): void {
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
  }

  //Erzeugung des Error-PopUps
  private errorPopUp(text: string) {
    this.choicePopUpVisible = false;
    this.symbol = '&otimes;';
    this.popupColor = '#8B0000';
    this.text = text;
  }

  //Erzeugung des Info-PopUps
  private infoPopUp(text: string) {
    this.choicePopUpVisible = false;
    this.symbol = '&#9432;';
    this.popupColor = '#473d3d';
    this.text = text;
  }

  //Erzeugung des Choice-PopUps
  private choicePopUp(text: string) {
    this.choicePopUpVisible = true;
    this.text = text;
  }

  //Wenn beim Coice-PopUp Ja gedrückt wurde
  choiceYes() {
    this.popUpService.respondToChoice(true);
  }

  //Wenn beim Coice-PopUp Nein gedrückt wurde
  choiceNo() {
    this.popUpService.respondToChoice(false);
  }
}
