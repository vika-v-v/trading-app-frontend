import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordUtilsService {

  constructor() { }

  public checkPassword(password: string): { width: string, color: string, text: string, isInvalid: boolean } {
    let strength = { width: '0%', color: '#ddd', text: '', isInvalid: false };

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      strength = { width: '100%', color: 'green', text: 'Stark', isInvalid: false };
    } else if (length >= 8 && hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChars)) {
      strength = { width: '66%', color: 'orange', text: 'Mittel', isInvalid: false };
    } else if (length >= 8) {
      strength = { width: '33%', color: 'yellow', text: 'Schwach', isInvalid: false };
    } else if (length > 0 && length < 8) {
      strength = { width: '0%', color: '#ddd', text: 'Ungültig', isInvalid: true };
    } else if (length === 0) {
      strength = { width: '0%', color: '#ddd', text: '', isInvalid: false };
    }
    return strength;
  }

  public checkPasswordMatch(password: string, password2: string): boolean {
    return password === password2;
  }
}
