import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsersLogin(params?: any): any {
    if (params instanceof FormData && params.get('email') == 'test@test.de'  && params.get('passwort') == 'test123') {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token-test@test.de"
      };
    }
    else {
      return {
        message: "Invalid email or password",
        statusCode: 400,
        data: null
      };
    }
  }
}
