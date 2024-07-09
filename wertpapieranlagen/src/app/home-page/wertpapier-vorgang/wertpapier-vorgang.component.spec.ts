import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WertpapierVorgangComponent } from './wertpapier-vorgang.component';

describe('WertpapierVorgangComponent', () => {
  let component: WertpapierVorgangComponent;
  let fixture: ComponentFixture<WertpapierVorgangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'ROOT_URL', useValue: 'https://example.com/api' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WertpapierVorgangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
