import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotUmbenennenComponent } from './depot-umbenennen.component';

describe('DepotUmbenennenComponent', () => {
  let component: DepotUmbenennenComponent;
  let fixture: ComponentFixture<DepotUmbenennenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotUmbenennenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepotUmbenennenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
