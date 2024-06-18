import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafikLinechartDepotComponent } from './grafik-linechart-depot.component';

describe('GrafikLinechartDepotComponent', () => {
  let component: GrafikLinechartDepotComponent;
  let fixture: ComponentFixture<GrafikLinechartDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafikLinechartDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrafikLinechartDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
