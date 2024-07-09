import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrafikLinechartWertpapierComponent } from './grafik-linechart-wertpapier.component';

describe('GrafikLinechartWertpapierComponent', () => {
  let component: GrafikLinechartWertpapierComponent;
  let fixture: ComponentFixture<GrafikLinechartWertpapierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
