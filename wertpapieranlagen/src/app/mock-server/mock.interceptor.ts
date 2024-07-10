import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { MockUserService } from './user.mock.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(@Inject('USE_MOCK') private useMock: boolean, private userMockService: MockUserService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.useMock) return next.handle(req);

    let mockData = null;

    if (req.url.endsWith("users/login") && req.method === 'POST') {
      mockData = this.userMockService.postUsersLogin(req.body);
    }
    else if(req.url.endsWith("users/register") && req.method === 'POST') {
      mockData = this.userMockService.postUsersRegister(req.body);
    }
    else if(req.url.endsWith("users/reset-passwort-initialisieren") && req.method === 'POST') {
      mockData = this.userMockService.postResetPassword(req.body);
    }
    else if(req.url.endsWith("users/update") && req.method === 'PATCH') {
      mockData = this.userMockService.patchUpdateUserData(req.body);
    }
    else if(req.url.endsWith("users/me") && req.method === 'GET') {
      mockData = this.userMockService.getUserData();
    }
    else if(req.url.endsWith("users/delete") && req.method === 'DELETE') {
      mockData = this.userMockService.deleteUser();
    }
    else if(req.url.endsWith("users/account-values") && req.method === 'POST') {
      mockData = this.userMockService.getUserAccountValue();
    }

    if(mockData != null) {
      return of(new HttpResponse({ status: mockData.statusCode, body: mockData }));
    }

    return next.handle(req);
  }
}
