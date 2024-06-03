import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotDropdownComponent } from './depot-dropdown.component';

describe('DepotDropdownComponent', () => {
  let component: DepotDropdownComponent;
  let fixture: ComponentFixture<DepotDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
