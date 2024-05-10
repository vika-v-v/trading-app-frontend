import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSeiteComponent } from './login-seite.component';

describe('LoginSeiteComponent', () => {
  let component: LoginSeiteComponent;
  let fixture: ComponentFixture<LoginSeiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSeiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginSeiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
