import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotErstellenComponent } from './depot-erstellen.component';

describe('DepotErstellenComponent', () => {
  let component: DepotErstellenComponent;
  let fixture: ComponentFixture<DepotErstellenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotErstellenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotErstellenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
