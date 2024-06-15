import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { DepotDropdownComponent } from './depot-dropdown.component';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { of } from 'rxjs';

// Mock the ROOT_URL if it's used in your service
const ROOT_URL = 'http://213.133.101.113:8080/api/'; // Replace with your actual ROOT_URL

class MockDepotDropdownService {
  getAllDepots() {
    // Mock implementation
    return of({ data: [{ depotId: '1', name: 'Depot 1' }, { depotId: '2', name: 'Depot 2' }] });
  }

  setDepot(name: string) {
    // Mock implementation
    console.log('Setting depot:', name);
  }
}

describe('DepotDropdownComponent', () => {
  let component: DepotDropdownComponent;
  let fixture: ComponentFixture<DepotDropdownComponent>;
  let depotService: DepotDropdownService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, CommonModule], // Import CommonModule here
      providers: [
        { provide: DepotDropdownService, useClass: MockDepotDropdownService },
        { provide: 'ROOT_URL', useValue: ROOT_URL } // Provide ROOT_URL here
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotDropdownComponent);
    component = fixture.componentInstance;
    depotService = TestBed.inject(DepotDropdownService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load depots on init', () => {
    const depots = [{ depotId: '1', name: 'Depot 1' }, { depotId: '2', name: 'Depot 2' }];
    spyOn(depotService, 'getAllDepots').and.returnValue(of({ data: depots }));

    component.ngOnInit();

    expect(component.depots).toEqual(depots);
    expect(component.errorMessage).toEqual('');
  });

  it('should filter depots correctly', () => {
    component.depots = [
      { depotId: '1', name: 'Depot 1' },
      { depotId: '2', name: 'Depot 2' },
      { depotId: '3', name: 'Another' }
    ];

    component.searchTerm = 'depo';

    component.filterDepots();

    expect(component.filteredDepots.length).toEqual(2);
    expect(component.filteredDepots[0].name).toContain('Depot');
    expect(component.filteredDepots[1].name).toContain('Depot');
  });

  it('should select depot on dropdown change', () => {
    const depots = [
      { depotId: '1', name: 'Depot 1' },
      { depotId: '2', name: 'Depot 2' }
    ];
    component.depots = depots;

    const event = new Event('change');
    Object.defineProperty(event, 'target', {
      value: {
        value: '2'
      },
      writable: true
    });

    spyOn(depotService, 'setDepot');

    component.onSelectDepot(event);

    expect(component.selectedDepot).toEqual(depots[1]);
    expect(depotService.setDepot).toHaveBeenCalledWith('Depot 2');
  });


});
