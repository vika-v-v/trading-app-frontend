import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AktienDropdownComponent } from './aktien-dropdown.component';

describe('AktienDropdownComponent', () => {
  let component: AktienDropdownComponent;
  let fixture: ComponentFixture<AktienDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'ROOT_URL', useValue: 'https://example.com/api' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AktienDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

