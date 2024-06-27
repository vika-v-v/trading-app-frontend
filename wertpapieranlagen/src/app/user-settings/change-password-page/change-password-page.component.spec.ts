import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ChangePasswordPageComponent } from './change-password-page.component';
import { UserService } from '../../services/user.service';
import { PasswordUtilsService } from '../../services/password-utils.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ChangePasswordPageComponent', () => {
  let component: ChangePasswordPageComponent;
  let fixture: ComponentFixture<ChangePasswordPageComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
      providers: [
        UserService,
        PasswordUtilsService,
        { provide: 'ROOT_URL', useValue: 'http://213.133.101.113:8080/api/' }
      ],
      declarations: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordPageComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change password', () => {
    const mockResponse = { statusCode: 200 };

    // Spy on userService.updateUserData and return mockResponse
    spyOn(userService, 'updateUserData').and.returnValue(of(mockResponse));

    // Set component properties
    component.password = 'newPassword';
    component.isPasswordInvalid = false;
    component.doPasswordsMatch = true;
    component.password2 = 'newPassword';

    // Call the method to be tested
    component.changePassword();

    // Expectations
    expect(userService.updateUserData).toHaveBeenCalled();
    expect(userService.updateUserData).toHaveBeenCalledWith(component['http'], { password: 'newPassword' });
  });
});
