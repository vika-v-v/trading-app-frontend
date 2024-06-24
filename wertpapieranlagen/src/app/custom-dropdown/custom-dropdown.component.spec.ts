import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { CustomDropdownComponent } from './custom-dropdown.component';
import { CommonModule } from '@angular/common';

describe('CustomDropdownComponent', () => {
  let component: CustomDropdownComponent;
  let fixture: ComponentFixture<CustomDropdownComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, CustomDropdownComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy('detectChanges') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDropdownComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dropdown with alwaysSelectOption', () => {
    component.alwaysSelectOption = 'Option 1';
    component.ngOnInit();
    expect(component.selectedOption).toBe('Option 1');
  });

  it('should initialize dropdown with default message when no alwaysSelectOption or selectedOption is provided', () => {
    component.ngOnInit();
    expect(component.selectedOption).toBe('Wählen Sie eine Option aus...');
  });

  it('should toggle dropdown open state', () => {
    component.dropdownOpen = false;
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTrue();

    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should select an option and emit selectionChange event', () => {
    spyOn(component.selectionChange, 'emit');

    const option = 'Option 1';
    component.selectOption(option);
    expect(component.selectedOption).toBe(option);
    expect(component.selectionChange.emit).toHaveBeenCalledWith(option);
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should select alwaysSelectOption when provided', () => {
    component.alwaysSelectOption = 'Always Option';
    const option = 'Option 1';
    component.selectOption(option);
    expect(component.selectedOption).toBe('Always Option');
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should not overwrite alwaysSelectOption when selecting another option', () => {
    component.alwaysSelectOption = 'Always Option';
    component.ngOnInit();
    expect(component.selectedOption).toBe('Always Option');

    component.selectOption('Option 2');
    expect(component.selectedOption).toBe('Always Option');
  });
});
