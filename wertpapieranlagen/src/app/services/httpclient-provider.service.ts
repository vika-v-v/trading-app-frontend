import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpclientProviderService {

  http!: HttpClient;

  setHttpClient(http: any): void {
    this.http = http;
  }

  getHttpClient(): HttpClient {
    return this.http;
  }

}
