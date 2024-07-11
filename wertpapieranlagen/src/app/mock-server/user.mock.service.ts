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
    else {
      return {
        message: "Invalid email or password",
        statusCode: 400,
        data: null
      };
    }
  }

  postUsersRegister(params?: any): any {
    return { "message": "Invalid email. Impossible to register without server, use the Testuser with email 'test@test.de' and password 'test123'", "statusCode": 400, "data": null };
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
    };
  }

  deleteUser(): any {
    return {
      message: "User successfully deleted",
      statusCode: 200
    };
  }

  getUserAccountValue(): any {
    return {
      "message": "Account values found",
      "statusCode": 200,
      "data": {
        "dataMap1": {
          "verlustverrechnungstopf": 250.0,
          "accountValue": 34681.6,
          "freibetrag": 100.0,
          "steuersatz": 0.25,
          "soli": 0.055,
          "kirchensteuer": 0.09
        },
        "dataMap2": {
          "historicalAccountValues": {
            "10-07-2024": 17340.8
          }
        }
      }
    };
  }
}
