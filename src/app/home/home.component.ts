import { Component, OnInit, HostListener }  from '@angular/core';
import { ConstantsService }                 from '../services/constants.service';
import { User }                             from '../interface/user';
import { Router }                           from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  initComponent: boolean;
  heightScroll: number;
  typeAccess: { type: string, action?: string } = { type: 'default' };
  userConversation: {user: any, action: string};
  user: User;
  profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1';

  constructor(
    private _ConstantsService: ConstantsService,
    private router: Router,
  ) { 
    this.initComponent = this._ConstantsService.ckeckUser();
  }

  ngOnInit() {
    this.onResize('');
    this.user = this._ConstantsService.getUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configTela(window.innerWidth, window.innerHeight) ;
  }

  configTela(width: number, height: number) {
    if (width <= 575) {
      if (this.typeAccess.type == 'default') {
        this.typeAccess = {type: 'mobile', action: 'home'};
      }
    }
    else this.typeAccess.type = 'default';
  }

  setAction(action: string) {
    this.typeAccess.action = action;
  }

  showChat(openChat: {user: any, action: string}) {
    this.userConversation = openChat; 
    this.typeAccess.action = 'chat';
  }

  close() {
    this._ConstantsService.setUser(undefined);
    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 500);
  }
}
