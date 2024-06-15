import { TestBed } from '@angular/core/testing';
import { PasswordUtilsService } from './password-utils.service';

describe('PasswordUtilsService', () => {
  let service: PasswordUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkPassword', () => {
    it('should return "Stark" for a strong password', () => {
      const password = 'StrongPassword123!@#';
      const result = service.checkPassword(password);
      expect(result.text).toBe('Stark');
      expect(result.color).toBe('green');
      expect(result.isInvalid).toBe(false);
    });

    it('should return "Mittel" for a medium strength password', () => {
      const password = 'Medium123';
      const result = service.checkPassword(password);
      expect(result.text).toBe('Mittel');
      expect(result.color).toBe('orange');
      expect(result.isInvalid).toBe(false);
    });

    it('should return "Schwach" for a weak password', () => {
      const password = 'password';
      const result = service.checkPassword(password);
      expect(result.text).toBe('Schwach');
      expect(result.color).toBe('yellow');
      expect(result.isInvalid).toBe(false);
    });


    it('should return "Ungültig" for a password less than 8 characters', () => {
      const password = 'Short1!';
      const result = service.checkPassword(password);
      expect(result.text).toBe('Ungültig');
      expect(result.isInvalid).toBe(true);
    });
  });

  describe('checkPasswordMatch', () => {
    it('should return true for matching passwords', () => {
      const password1 = 'Password123!';
      const password2 = 'Password123!';
      const result = service.checkPasswordMatch(password1, password2);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      const password1 = 'Password123!';
      const password2 = 'Password456!';
      const result = service.checkPasswordMatch(password1, password2);
      expect(result).toBe(false);
    });
  });
});
