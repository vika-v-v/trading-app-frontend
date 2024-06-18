import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafikPiechartNumberComponent } from './grafik-piechart-number.component';

describe('GrafikPiechartNumberComponent', () => {
  let component: GrafikPiechartNumberComponent;
  let fixture: ComponentFixture<GrafikPiechartNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafikPiechartNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrafikPiechartNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
