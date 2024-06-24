import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TabelleComponent } from './tabelle.component';

describe('TabelleComponent', () => {
  let component: TabelleComponent;
  let fixture: ComponentFixture<TabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: 'ROOT_URL', useValue: 'https://example.com/api' },
        { provide: 'SORTINGS_AND_FILTERS', useValue: './filter.class.ts'}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
