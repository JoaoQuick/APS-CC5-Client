import { Component, OnInit, HostListener } from '@angular/core';
import { ConstantsService }  from '../services/constants.service';
import { FirebaseService }  from '../services/firebase.service';
import { RegisterConversation } from '../interface/registerConversation';
import { EventsCommunicationsService }  from '../services/events-communications.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  initComponent: boolean;
  heightScroll: number;
  typeAccess: {
    type: string,
    action?: string
  } = {
    type: 'default'
  };
  userConversation: {user: any, action: string};
  

  constructor(
    private _ConstantsService: ConstantsService,
    private _eventComunication: EventsCommunicationsService,
  ) { 
    // this.initComponent = this._ConstantsService.ckeckUser();
  }

  ngOnInit() {
    this.onResize('');
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

  accessAction(action: string) {
    this.typeAccess.action = action;
  }

  showChat(openChat: {user: any, action: string}) {
    this.userConversation = openChat; 
    this.typeAccess.action = 'chat';
  }
}
