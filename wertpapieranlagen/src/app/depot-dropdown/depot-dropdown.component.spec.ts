import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepotDropdownComponent } from './depot-dropdown.component';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { UpdateEverythingService } from '../services/update-everything.service';
import { PopUpService } from '../services/pop-up.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';
import { AktienDropdownComponent } from '../aktien-dropdown/aktien-dropdown.component';

describe('DepotDropdownComponent', () => {
  let component: DepotDropdownComponent;
  let fixture: ComponentFixture<DepotDropdownComponent>;
  let depotService: jasmine.SpyObj<DepotDropdownService>;
  let updateEverythingService: jasmine.SpyObj<UpdateEverythingService>;
  let popupService: jasmine.SpyObj<PopUpService>;

  beforeEach(async () => {
    const depotServiceSpy = jasmine.createSpyObj('DepotDropdownService', ['getAllDepots', 'setDepot', 'getDepot']);
    const updateEverythingServiceSpy = jasmine.createSpyObj('UpdateEverythingService', ['subscribeToUpdates', 'updateAll']);
    const popupServiceSpy = jasmine.createSpyObj('PopUpService', ['errorPopUp']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        DepotDropdownComponent, // Import the standalone component
        CustomDropdownComponent, // Import dependent components
        AktienDropdownComponent  // Import dependent components
      ],
      providers: [
        { provide: DepotDropdownService, useValue: depotServiceSpy },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) },
        { provide: UpdateEverythingService, useValue: updateEverythingServiceSpy },
        { provide: PopUpService, useValue: popupServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepotDropdownComponent);
    component = fixture.componentInstance;
    depotService = TestBed.inject(DepotDropdownService) as jasmine.SpyObj<DepotDropdownService>;
    updateEverythingService = TestBed.inject(UpdateEverythingService) as jasmine.SpyObj<UpdateEverythingService>;
    popupService = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
  });

  it('should create', () => {
    depotService.getAllDepots.and.returnValue(of({ data: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle error when fetching depots', () => {
    const errorMessage = 'Failed to fetch depots';
    depotService.getAllDepots.and.returnValue(throwError({ message: errorMessage }));

    fixture.detectChanges();

    expect(depotService.getAllDepots).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Fehler beim Abrufen der Depots: ' + errorMessage);
  });

  it('should set initial depot', () => {
    component.filteredDepots = ['Depot1', 'Depot2'];
    component.setInitialDepot();

    expect(depotService.setDepot).toHaveBeenCalledWith('Depot2');
  });

  it('should select a depot', () => {
    const depot = 'Depot1';
    component.onSelectDepot(depot);

    expect(depotService.setDepot).toHaveBeenCalledWith(depot);
  });

  it('should update depots when update is called', () => {
    const mockDepots = { data: [{ name: 'Depot1' }, { name: 'Depot2' }] };
    depotService.getAllDepots.and.returnValue(of(mockDepots));
    depotService.getDepot.and.returnValue('Depot1');

    component.update();

    expect(depotService.getDepot).toHaveBeenCalled();
    expect(depotService.getAllDepots).toHaveBeenCalled();
    expect(component.filteredDepots).toEqual(['Depot1', 'Depot2']);
  });
});
