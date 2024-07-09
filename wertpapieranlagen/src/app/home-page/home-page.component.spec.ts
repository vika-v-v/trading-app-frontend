import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { DepotService } from '../services/depot.service';
import { UserService } from '../services/user.service';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { PopUpService } from '../services/pop-up.service';
import { UpdateEverythingService } from '../services/update-everything.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        DepotService,
        UserService,
        DepotDropdownService,
        PopUpService,
        UpdateEverythingService,
        { provide: 'ROOT_URL', useValue: 'http://localhost:3000' } // Provide ROOT_URL here
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
