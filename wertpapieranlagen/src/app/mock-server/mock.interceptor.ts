import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { UserService } from './user.mock.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(@Inject('USE_MOCK') private useMock: boolean, private userMockService: UserService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.useMock) return next.handle(req);

    if (req.url.endsWith("users/login") && req.method === 'POST') {
      const mockData = this.userMockService.getUsersLogin(req.body);
      return of(new HttpResponse({ status: mockData.statusCode, body: mockData }));
    }

    return next.handle(req);
  }
}
