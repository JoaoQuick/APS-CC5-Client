import { Injectable }   from '@angular/core';
import { User }         from '../interface/user';
import { Router }       from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(
    private router: Router
  ) { }

  private url: string = 'https://f6ee6783.ngrok.io';
  // private user: User;
  private user: User = {
    email: 'joaovitor-15@live.com',
    nickname: 'João Vitor',
    token: "eyJwYXNzd29yZCI6InJvb3QxMiIsImVtYWlsIjoiam9hb3ZpdG9yLTE1QGxpdmUuY29tIn0",
    profile_photo: 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/profile_photo%2Fdownload.jpg-1587777183632?alt=media&token=83668791-49e3-4a4b-8240-9848da66d08f'
  };

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
