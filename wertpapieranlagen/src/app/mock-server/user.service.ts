import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getMockData(url: string, params?: any): any {
    if (url.endsWith('users/login')) {
      return {
        message: "User successfully logged in",
        statusCode: 200,
        data: "fake-token"
      };
    }
    // Add more conditions as needed for other endpoints
    return null; // or some default fallback data
  }
}
