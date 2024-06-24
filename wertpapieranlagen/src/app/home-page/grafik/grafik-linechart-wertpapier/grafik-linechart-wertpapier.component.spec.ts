import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GrafikLinechartWertpapierComponent } from './grafik-linechart-wertpapier.component';

describe('GrafikLinechartWertpapierComponent', () => {
  let component: GrafikLinechartWertpapierComponent;
  let fixture: ComponentFixture<GrafikLinechartWertpapierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: 'ROOT_URL', useValue: 'https://example.com/api' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GrafikLinechartWertpapierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
