import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DepotMockService {

  depots: any[] = [];


  constructor(private userService: UserService) { }

  initTestUserDepots() {

  }

  getDepots(): any {
    if(this.userService.getToken() === 'fake-token-test@test.de') {
      return fetch('./testuser_depots.json')
        .then(response => response.json())
        .catch(error => {
          console.error('Error fetching depots:', error);
          return null;
        });
    }
  }
}
