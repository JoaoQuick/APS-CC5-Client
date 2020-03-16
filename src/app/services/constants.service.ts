import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  private urlUser: string = 'https://8c6bbc01.ngrok.io';

  getUrlUser(): string {
    return this.urlUser;
  }

  setUrl(newUrl: string): void {
    this.urlUser = newUrl;
  }
}
