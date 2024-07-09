import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  /*
  constructor(private mockServerService: UserService) {
    console.log('MockInterceptor initialized');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted request:');
    if (req.url === "http://localhost:4200/api/users/login" && req.method === 'POST') {
      const mockData = this.mockServerService.getMockData(req.url, req.body);
      return of(new HttpResponse({ status: 200, body: mockData }));
    }
    return next.handle(req); // Pass through other requests
  }*/

  constructor(private injector: Injector) {
    console.log('MockInterceptor initialized');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepting request:', req.url);
    return next.handle(req);
  }
}
