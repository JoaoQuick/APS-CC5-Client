import { Injectable }   from '@angular/core';
import { User }         from '../interfaces/user';
import { Router }       from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(
    private router: Router
  ) { }

  private url: string = 'https://3cdb2ff2.ngrok.io';
  private user: User;
  // private user: User = {
  //   email: 'joaovitor-15@live.com',
  //   nickname: 'João Vitor',
  //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6InJvb3QxMiIsImVtYWlsIjoiam9hb3ZpdG9yLTE1QGxpdmUuY29tIn0.NGnsUaZP3WkddhtawY2GuV3Q2N6mK-lPgtYHJYLWWjE",
  //   profile_photo: 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/profile_photo%2Fdownload.jpg-1587777183632?alt=media&token=83668791-49e3-4a4b-8240-9848da66d08f'
  // };

  ngOnInit() {
  }
  
  getUrl(): string {
    return this.url;
  }

  setUrl(newUrl: string): void {
    this.url = newUrl;
  }

  ckeckUser(): boolean {
    if (!this.user || !this.user.token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: any) {
    this.user = user;
  }
}
