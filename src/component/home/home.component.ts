import { Component, OnInit, HostListener,
          OnDestroy }                       from '@angular/core';
import { ConstantsService }                 from '../../services/constants.service';
import { User }                             from '../../interfaces/user';
import { Router }                           from '@angular/router';
import {MatDialog }                         from '@angular/material/dialog';
import { ProfileComponent }                 from '../profile/profile.component'
import { FirebaseService }                  from '../../services/firebase.service'
import { Subscription } from 'rxjs';
import { EventsCommunicationsService }  from '../../services/events-communications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private initComponent: boolean;
  heightScroll: number;
  typeAccess: { type: string, action?: string } = { type: 'default' };
  userConversation: {user: any, action: string};
  user: User;
  profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1';
  sizePhoto: number;
  marginTextMenu: number;
  getUsersSubscriber: Subscription;

  constructor(
    private _ConstantsService: ConstantsService,
    private router: Router,
    private _fb: FirebaseService,
    public dialog: MatDialog,
    private _event: EventsCommunicationsService,
  ) { 
    this.initComponent = this._ConstantsService.ckeckUser();
  }

  ngOnInit() {
    this.onResize('');
    this.paramsUser();
  }

  ngOnDestroy() {
    if(this.getUsersSubscriber)
      this.getUsersSubscriber.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configTela(window.innerWidth, window.innerHeight) ;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: this.sizeDialog('width'), 
      height: this.sizeDialog('height'), 
      id: 'app-profile',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  paramsUser() {
    this.getUsersSubscriber = this._fb.getUser(this._ConstantsService.getUser().token).subscribe(
      user => this.user = user
    );
  }
  
  sizeDialog(type: string): string {
    if (type == 'width') {
      switch(this.typeAccess.type) {
        case 'mobile': {
          return window.innerWidth * 0.9 + 'px';
          break;
        }
        case 'tablet': {
          return window.innerWidth * 0.8 + 'px';
          break;
        }
        case 'default': {
          return window.innerWidth * 0.6 + 'px';
          break;
        }
      }
    }
    else if (type == 'height')
      return window.innerHeight * 0.8 + 'px'
  }
  configTela(width: number, height: number) {
    if (width <= 575) {
      if (this.typeAccess.type != 'mobile') {
        this.typeAccess = {type: 'mobile', action: 'home'};
      }
    }
    else if (width <= 850) {
      if (this.typeAccess.type != 'tablet') {
        this.typeAccess = {type: 'tablet', action: 'chat-global'};
      }
    }
    else this.typeAccess.type = 'default';
    this.sizePhoto = height * 0.065
  }

  setAction(action: string) {
    this.typeAccess.action = action;
  }

  showChat(UsersConversations: {user: any, action: string}) {
    if (this.typeAccess.action == 'chat')
      this._event.initConversationMobile.emit(UsersConversations);
    else {
      this.userConversation = UsersConversations; 
      this.typeAccess.action = 'chat';
    }
    
  }

  close() {
    this._ConstantsService.setUser(undefined);
    setTimeout(() => {
      this.router.navigate(['/login'])
    }, 500);
  }
}
