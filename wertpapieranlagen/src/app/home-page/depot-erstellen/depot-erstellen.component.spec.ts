import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepotDropdownService } from '../../services/depot-dropdown.service';
import { DepotService } from '../../services/depot.service';
import { UpdateEverythingService } from '../../services/update-everything.service';
import { PopUpService } from '../../services/pop-up.service';
import { DepotErstellenComponent } from './depot-erstellen.component';

describe('DepotErstellenComponent', () => {
  let component: DepotErstellenComponent;
  let fixture: ComponentFixture<DepotErstellenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        CommonModule
      ],
      providers: [
        DepotDropdownService,
        DepotService,
        UpdateEverythingService,
        PopUpService,
        { provide: 'ROOT_URL', useValue: 'https://example.com/api' } // Provide ROOT_URL here
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepotErstellenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.name).toEqual('');
    expect(component.nameFieldInvalid).toBeFalsy();
    expect(component.selectedWaehrung).toEqual('Euro');
    expect(component.moeglicheWaehrungen).toEqual(['Euro', 'US-Dollar']);
  });
});
