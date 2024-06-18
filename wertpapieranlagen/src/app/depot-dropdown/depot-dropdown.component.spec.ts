import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { DepotDropdownComponent } from './depot-dropdown.component';
import { DepotDropdownService } from '../services/depot-dropdown.service';
import { of, Subject } from 'rxjs';
import { ChangeDetectorRef, NgZone } from '@angular/core';

const ROOT_URL = 'http://213.133.101.113:8080/api/';

class MockDepotDropdownService {
  private reloadSubject = new Subject<void>();
  private currentDepot: string = '';

  getAllDepots() {
    return of({ data: [{ depotId: '1', name: 'Depot 1' }, { depotId: '2', name: 'Depot 2' }] });
  }

  setDepot(name: string) {
    console.log('Setting depot:', name);
    this.currentDepot = name;
  }

  getDepot() {
    return this.currentDepot;
  }

  getReloadObservable() {
    return this.reloadSubject.asObservable();
  }

  triggerReload() {
    this.reloadSubject.next();
  }
}

describe('DepotDropdownComponent', () => {
  let component: DepotDropdownComponent;
  let fixture: ComponentFixture<DepotDropdownComponent>;
  let depotService: MockDepotDropdownService;
  let cdr: ChangeDetectorRef;
  let ngZone: NgZone;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, CommonModule, DepotDropdownComponent],
      providers: [
        { provide: DepotDropdownService, useClass: MockDepotDropdownService },
        { provide: 'ROOT_URL', useValue: ROOT_URL }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotDropdownComponent);
    component = fixture.componentInstance;
    depotService = TestBed.inject(DepotDropdownService) as unknown as MockDepotDropdownService;
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    ngZone = fixture.debugElement.injector.get(NgZone);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  }));

  it('should load depots on init', waitForAsync(() => {
    const depots = [{ depotId: '1', name: 'Depot 1' }, { depotId: '2', name: 'Depot 2' }];
    spyOn(depotService, 'getAllDepots').and.returnValue(of({ data: depots }));

    ngZone.run(() => {
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.depots).toEqual(depots);
        expect(component.filteredDepots).toEqual(depots.map(depot => ({ value: depot.depotId, label: depot.name })));
        expect(component.errorMessage).toEqual('');
      });
    });
  }));

  it('should filter depots correctly', waitForAsync(() => {
    component.depots = [
      { depotId: '1', name: 'Depot 1' },
      { depotId: '2', name: 'Depot 2' },
      { depotId: '3', name: 'Another' }
    ];
    component.searchTerm = 'depo';

    ngZone.run(() => {
      component.filterDepots();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.filteredDepots.length).toEqual(2);
        expect(component.filteredDepots).toEqual([
          { depotId: '1', name: 'Depot 1' },
          { depotId: '2', name: 'Depot 2' }
        ]);
      });
    });
  }));

  it('should select depot on dropdown change', waitForAsync(() => {
    const depots = [
      { depotId: '1', name: 'Depot 1' },
      { depotId: '2', name: 'Depot 2' }
    ];
    component.depots = depots;

    spyOn(depotService, 'setDepot');

    ngZone.run(() => {
      component.onSelectDepot('2');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.selectedDepot).toEqual(depots[1]);
        expect(depotService.setDepot).toHaveBeenCalledWith('Depot 2');
      });
    });
  }));

  it('should unsubscribe on destroy', waitForAsync(() => {
    const subscriptionSpy = spyOn(component['reloadSubscription'], 'unsubscribe');

    ngZone.run(() => {
      component.ngOnDestroy();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(subscriptionSpy).toHaveBeenCalled();
      });
    });
  }));
});
