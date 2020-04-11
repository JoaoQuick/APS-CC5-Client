import { Injectable } from '@angular/core';
import { User } from '../interface/user';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(
    private router: Router
  ) { }

  private url: string = 'http://127.0.0.1:8080';
  // private user: User;
  private user: User = {
    email: 'joaovitor-15@live.com',
    nickname: 'João Vitor',
    token: "eyJwYXNzd29yZCI6InJvb3QxMiIsImVtYWlsIjoiam9hb3ZpdG9yLTE1QGxpdmUuY29tIn0"
  };

  ngOnInit() {
  }
  
  getUrl(): string {
    return this.url;
  }

  setUrl(newUrl: string): void {
    this.url = newUrl;
  }

  ckeckUser(): void {
    if (!this.user || !this.user.token)
      this.router.navigate(['/login']);
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }
}
