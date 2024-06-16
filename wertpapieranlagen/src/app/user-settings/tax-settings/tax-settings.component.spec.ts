import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxSettingsComponent } from './tax-settings.component';

describe('TaxSettingsComponent', () => {
  let component: TaxSettingsComponent;
  let fixture: ComponentFixture<TaxSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ], // Add necessary imports here if any
      declarations: [ ], // Remove TaxSettingsComponent from here
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit resetClicked event when onReset is called', () => {
    let resetClicked = false;
    component.resetClicked.subscribe(() => {
      resetClicked = true;
    });
    component.onReset();
    expect(resetClicked).toBeTruthy();
  });
});
