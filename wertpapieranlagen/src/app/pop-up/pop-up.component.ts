import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopUpService} from '../services/pop-up.service';


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
  choicePopUpVisible: boolean = true;
  private popupSubscription: Subscription;

  constructor(private popUpService: PopUpService) {
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

  ngOnDestroy(): void {
    this.popupSubscription.unsubscribe();
  }

  private errorPopUp(text: string) {
    this.choicePopUpVisible = false;
    this.symbol = '&otimes;';
    this.popupColor = '#8B0000';
    this.text = text;
  }

  private infoPopUp(text: string) {
    this.choicePopUpVisible = false;
    this.symbol = '&#9432;';
    this.popupColor = '#9c9c9c';
    this.text = text;
  }

  private choicePopUp(text: string) {
    this.choicePopUpVisible = true;
    this.text = text;
  }

  choiceYes(){
    this.popUpService.hidePopUp();
  }

  choiceNo(){
    this.popUpService.hidePopUp();
  }
}


