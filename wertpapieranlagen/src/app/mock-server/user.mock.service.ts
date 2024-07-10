import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service'
@Injectable({
  providedIn: 'root'
})
export class MockUserService {

  constructor(private userService: UserService) { }

  postUsersLogin(params?: any): any {
    const email = params.get('email');
    const password = params.get('passwort');

    if (params instanceof FormData && email == 'test@test.de' && password == 'test123') {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token-test@test.de"
      };
    }
    else if (params instanceof FormData && email != "undefined" && password != "undefined" && email.length > 1 && password.length > 1) {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token-new-user"
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

  patchUpdateUserData(params?: any): any {
    return {
      message: "The data was successfully updated.",
      statusCode: 200
    };
  }

  getUserData(): any {
    if (this.userService.getToken() === 'fake-token-test@test.de') {
      return {
        "message": "User found",
        "statusCode": 200,
        "data": {
          "userId": "668d3a985f6a8d72b45d5aeb",
          "email": "test@test.de",
          "username": "user242684",
          "password": "$2a$10$/UBFCSK6tb0mYkK9fGzGQerq56PeWY98PqyFmWe1.Jc/jWb1noDGm",
          "vorname": "Max",
          "nachname": "Meyer",
          "telefonnummer": "+49123456789",
          "depotIds": [],
          "accountValue": 17340.8,
          "historicalAccountValues": {
            "10-07-2024": 17340.8
          },
          "roles": [
            "ROLE_USER"
          ],
          "passwordResetToken": null,
          "accountVerificationToken": "3861c1d3-7c20-44cd-9ab7-f209f4047f03",
          "enabled": true,
          "freibetrag": 100.0,
          "steuersatz": 0.25,
          "kirchensteuer": 0.09,
          "hausnummer": "1",
          "adresseInitial": false,
          "steuerInitial": true,
          "emailVerified": false,
          "soli": 0.055,
          "strasse": " Example Street",
          "ort": "Bielefeld",
          "plz": "33611",
          "verlustverrechnungstopf": 250.0,
          "accountNonLocked": true,
          "credentialsNonExpired": true,
          "accountNonExpired": true
        }
      }
    }
    else {
      return {
        "message": "User found",
        "statusCode": 200,
        "data": {
          "userId": "668ea646d0f6e81ac80cabbf",
          "email": "viktoriia.vovchenko@hsbi.de",
          "username": "user895688",
          "password": "$2a$10$Inju6wDTdtGxMG4BOp7QZemcp1JY4v9HCpRUOx/BzSzaaEyZ3.SBq",
          "vorname": null,
          "nachname": null,
          "telefonnummer": null,
          "depotIds": [],
          "accountValue": 0.0,
          "historicalAccountValues": {},
          "roles": [
            "ROLE_USER"
          ],
          "passwordResetToken": null,
          "accountVerificationToken": "896d82e8-c535-4413-93c4-b26f2c9c02fc",
          "enabled": true,
          "freibetrag": 800.0,
          "steuersatz": 0.25,
          "kirchensteuer": 0.09,
          "hausnummer": "",
          "adresseInitial": true,
          "steuerInitial": true,
          "emailVerified": false,
          "soli": 0.055,
          "strasse": "",
          "ort": "",
          "plz": "",
          "verlustverrechnungstopf": 0.0,
          "accountNonLocked": true,
          "credentialsNonExpired": true,
          "accountNonExpired": true
        }
      }
    }
  }
}
