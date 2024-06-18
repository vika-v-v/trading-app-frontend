import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafikPiechartValueComponent } from './grafik-piechart-value.component';

describe('GrafikPiechartValueComponent', () => {
  let component: GrafikPiechartValueComponent;
  let fixture: ComponentFixture<GrafikPiechartValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafikPiechartValueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrafikPiechartValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
