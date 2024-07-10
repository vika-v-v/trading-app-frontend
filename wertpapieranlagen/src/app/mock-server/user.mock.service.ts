import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  postUsersLogin(params?: any): any {
    if (params instanceof FormData && params.get('email') == 'test@test.de'  && params.get('passwort') == 'test123') {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token-test@test.de"
      };
    }
    else {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token-new-user"
      };
    }
  }

  postUsersRegister(params?: any): any {
    return {
      message: "User successfully registered",
      statusCode: 200,
      data: "fake-token-new-user"
    };
  }

  postResetPassword(params?: any): any {
    return {
      message: "The password was successfully reset.",
      statusCode: 200
    };
  }

  patchUsersUpdate(params?: any): any {
    return {
      message: "The data was successfully updated.",
      statusCode: 200
    };
  }
}
