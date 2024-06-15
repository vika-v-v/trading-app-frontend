import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { PopUpService } from './services/pop-up.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PopUpComponent } from './pop-up/pop-up.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: jasmine.SpyObj<Router>;
  let popUpService: jasmine.SpyObj<PopUpService>;
  let mockPopUpVisible$: BehaviorSubject<boolean>;
  let mockAnzeigenPopup$: BehaviorSubject<{ text: string, type: string }>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockPopUpVisible$ = new BehaviorSubject<boolean>(false);
    mockAnzeigenPopup$ = new BehaviorSubject<{ text: string, type: string }>({ text: '', type: '' });

    const popUpServiceSpy = jasmine.createSpyObj('PopUpService', ['hidePopUp'], {
      popUpVisible$: mockPopUpVisible$.asObservable(),
      anzeigenPopup$: mockAnzeigenPopup$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule,
        PopUpComponent,  // Import the standalone component
        AppComponent,    // Import the standalone component
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PopUpService, useValue: popUpServiceSpy },
      ]
    }).compileComponents();

    // Initialize variables here to avoid redefinition issues
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popUpService = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login-seite on initialization', fakeAsync(() => {
    tick(); // Wait for async operations to complete
    expect(router.navigate).toHaveBeenCalledWith(['login-seite']);
  }));

  it('should set popUpVisible when popUpService emits value', fakeAsync(() => {
    expect(component.popUpVisible).toBe(false); // Initial value

    // Emit new value from the mock service
    mockPopUpVisible$.next(true);
    tick(); // Simulate the passage of time for async operations
    fixture.detectChanges(); // Trigger change detection

    // Expect the component's popUpVisible to update
    expect(component.popUpVisible).toBe(true);
  }));
});
