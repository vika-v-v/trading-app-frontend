import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonDepotExistingComponent } from './non-depot-existing.component';

describe('NonDepotExistingComponent', () => {
  let component: NonDepotExistingComponent;
  let fixture: ComponentFixture<NonDepotExistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonDepotExistingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonDepotExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
