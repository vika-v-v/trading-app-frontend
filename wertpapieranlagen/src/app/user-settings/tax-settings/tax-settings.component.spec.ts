import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxSettingsComponent } from './tax-settings.component';
import { UserService } from '../../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('TaxSettingsComponent', () => {
  let component: TaxSettingsComponent;
  let fixture: ComponentFixture<TaxSettingsComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAccountValue']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, TaxSettingsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxSettingsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    userService.getAccountValue.and.returnValue(of({
      statusCode: 200,
      data: {
        dataMap1: {
          verlustverrechnungstopf: 1000,
          accountValue: 5000,
          freibetrag: 800,
          steuersatz: 0.25,
          soli: 0.05,
          kirchensteuer: 0.08
        },
        dataMap2: {
          historicalAccountValues: {
            '24.06.2024': 340000
          }
        }
      }
    }));

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle steuerinfo visibility', () => {
    const steuerinfo = document.createElement('div');
    steuerinfo.id = 'Steuerinfo';
    steuerinfo.style.display = 'none';
    document.body.appendChild(steuerinfo);

    component.toggleSteuerinfo();
    expect(steuerinfo.style.display).toBe('block');

    component.toggleSteuerinfo();
    expect(steuerinfo.style.display).toBe('none');

    document.body.removeChild(steuerinfo);
  });

  it('should reset all values on reset', () => {
    userService.getAccountValue.and.returnValue(of({
      statusCode: 200,
      data: {
        dataMap1: {
          verlustverrechnungstopf: 1000,
          accountValue: 5000,
          freibetrag: 800,
          steuersatz: 0.25,
          soli: 0.05,
          kirchensteuer: 0.08
        },
        dataMap2: {
          historicalAccountValues: {
            '24.06.2024': 340000
          }
        }
      }
    }));

    component.onReset();

    expect(component.verlustverrechnungstopf).toBe(1000);
    expect(component.steuersatz).toBe(25);
    expect(component.soli).toBe(5);
    expect(component.kirchensteuer).toBe(8);
    expect(component.steuerfreibetrag).toBe(800);
    expect(component.kapitalgewinne_brutto).toBe(340000);
    component.calculateSteuerbelastung();
    expect(component.steuerbelastung).toBeDefined();
    expect(component.kapitalgewinne_netto).toBeDefined();
  });

  it('should handle form submission', () => {
    const event = new Event('submit');
    spyOn(console, 'log');

    component.onSubmit(event);

    expect(console.log).toHaveBeenCalledWith('Form submitted!');
  });
});
