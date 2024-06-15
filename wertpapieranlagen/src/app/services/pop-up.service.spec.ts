import { TestBed } from '@angular/core/testing';
import { PopUpService } from './pop-up.service';

describe('PopUpService', () => {
  let service: PopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopUpService]
    });
    service = TestBed.inject(PopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error pop-up', () => {
    service.errorPopUp('Test error message');
    service.popUpVisible$.subscribe(visible => {
      expect(visible).toBeTrue();
    });
    setTimeout(() => {
      service.popUpVisible$.subscribe(visible => {
        expect(visible).toBeFalse();
      });
    }, 3000);
  });

  it('should show info pop-up', () => {
    service.infoPopUp('Test info message');
    service.popUpVisible$.subscribe(visible => {
      expect(visible).toBeTrue();
    });
    setTimeout(() => {
      service.popUpVisible$.subscribe(visible => {
        expect(visible).toBeFalse();
      });
    }, 3000);
  });

  it('should show choice pop-up', () => {
    service.choicePopUp('Test choice message');
    service.popUpVisible$.subscribe(visible => {
      expect(visible).toBeTrue();
    });
  });

  it('should hide pop-up', () => {
    service.hidePopUp();
    service.popUpVisible$.subscribe(visible => {
      expect(visible).toBeFalse();
    });
  });
});
