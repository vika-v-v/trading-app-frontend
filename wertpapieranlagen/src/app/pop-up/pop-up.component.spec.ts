import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpComponent } from './pop-up.component';
import { PopUpService } from '../services/pop-up.service';
import { BehaviorSubject } from 'rxjs';

describe('PopUpComponent', () => {
  let component: PopUpComponent;
  let fixture: ComponentFixture<PopUpComponent>;
  let popUpService: PopUpService;
  let popupSubscription: BehaviorSubject<{ text: string, type: 'fehler' | 'info' | 'choice' }>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [], // Remove PopUpComponent from here
      providers: [ PopUpService ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpComponent);
    component = fixture.componentInstance;
    popUpService = TestBed.inject(PopUpService);

    // Accessing the private popupSubscription variable
    popupSubscription = (component as any).popupSubscription;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error pop up', () => {
    const errorText = 'Error message';
    popUpService.errorPopUp(errorText);

    expect(component.text).toBe(errorText);
    expect(component.popupColor).toBe('#8B0000');
    expect(component.symbol).toBe('&otimes;');
    expect(component.choicePopUpVisible).toBe(false);
  });

  it('should display info pop up', () => {
    const infoText = 'Info message';
    popUpService.infoPopUp(infoText);

    expect(component.text).toBe(infoText);
    expect(component.popupColor).toBe('#473d3d');
    expect(component.symbol).toBe('&#9432;');
    expect(component.choicePopUpVisible).toBe(false);
  });

  it('should display choice pop up', () => {
    const choiceText = 'Choice message';
    popUpService.choicePopUp(choiceText);

    expect(component.text).toBe(choiceText);
    expect(component.choicePopUpVisible).toBe(true);
  });

  it('should unsubscribe from popUpSubscription on ngOnDestroy', () => {
    spyOn(popupSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(popupSubscription.unsubscribe).toHaveBeenCalled();
  });
});
