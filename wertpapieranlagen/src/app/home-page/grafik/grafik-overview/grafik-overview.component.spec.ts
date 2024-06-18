import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrafikOverviewComponent } from './grafik-overview.component';

describe('GrafikOverviewComponent', () => {
  let component: GrafikOverviewComponent;
  let fixture: ComponentFixture<GrafikOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafikOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrafikOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
