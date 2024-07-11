import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { MockUserService } from './user.mock.service';
import { DepotMockService } from './depot.mock.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(@Inject('USE_MOCK') private useMock: boolean, private userMockService: MockUserService, private depotMockService: DepotMockService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.useMock) return next.handle(req);

    let mockData = null;

    if (req.url.endsWith("users/login")) {
      mockData = this.userMockService.postUsersLogin(req.body);
    }
    else if(req.url.endsWith("users/register")) {
      mockData = this.userMockService.postUsersRegister(req.body);
    }
    else if(req.url.endsWith("users/reset-passwort-initialisieren")) {
      mockData = this.userMockService.postResetPassword(req.body);
    }
    else if(req.url.endsWith("users/update")) {
      mockData = this.userMockService.patchUpdateUserData(req.body);
    }
    else if(req.url.endsWith("users/me")) {
      mockData = this.userMockService.getUserData();
    }
    else if(req.url.endsWith("users/delete")) {
      mockData = this.userMockService.deleteUser();
    }
    else if(req.url.endsWith("users/account-values")) {
      mockData = this.userMockService.getUserAccountValue();
    }
    else if(req.url.endsWith("depot/getAllDepots")) {
      mockData = this.depotMockService.getDepots();
    }
    else if(req.url.endsWith("depot/create")) {
      mockData = this.depotMockService.createDepot();
    }
    else if(req.url.endsWith("depot/rename")) {
      mockData = this.depotMockService.renameDepot();
    }
    else if(req.url.includes("depot/getWertpapierDepotHistorie?depotName=")) {
      mockData = this.depotMockService.getWertverlauf(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.includes("depot/getWertpapiere?depotName=")) {
      mockData = this.depotMockService.getWertpapiere(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.endsWith("wertpapier/getAllWertpapiere")) {
      mockData = this.depotMockService.getAllWertpapiere();
    }
    else if(req.url.includes("depot/getTransactions?depotName=")) {
      mockData = this.depotMockService.getTransactions(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.includes("depot/getDividenden?depotName=")) {
      mockData = this.depotMockService.getDividents(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.includes("depot/getDepot?depotName")) {
      mockData = this.depotMockService.getDepot(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.includes("depot/delete?name=")) {
      mockData = this.depotMockService.deleteDepot();
    }
    else if(req.url.endsWith("excel/download")) {
      mockData = this.depotMockService.export();
    }
    else if(req.url.includes("depot/getDepotGesamtwertHistorie?depotName=")) {
      mockData = this.depotMockService.getDepotHistory(req.url.substring(req.url.indexOf("depotName=") + 10));
    }
    else if(req.url.endsWith("depot/addDividende")) {
      mockData = this.depotMockService.addDividens();
    }

    if(mockData != null) {
      return of(new HttpResponse({ status: mockData.statusCode, body: mockData }));
    }

    return next.handle(req);
  }
}
