import { Component, OnInit, HostListener }  from '@angular/core';
import { ConstantsService }                 from '../../services/constants.service';
import { User }                             from '../../interfaces/user';
import { Router }                           from '@angular/router';
import {MatDialog }                         from '@angular/material/dialog';
import { ProfileComponent }                 from '../profile/profile.component'
import { FirebaseService }                  from '../../services/firebase.service'
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
  sizePhoto: number;
  marginTextMenu: number

  constructor(
    private _ConstantsService: ConstantsService,
    private router: Router,
    private _fb: FirebaseService,
    public dialog: MatDialog,
  ) { 
    this.initComponent = this._ConstantsService.ckeckUser();
  }

  ngOnInit() {
    this.onResize('');
    this.paramsUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configTela(window.innerWidth, window.innerHeight) ;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: '450px', 
      height: '600px', 
      id: 'app-profile',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  paramsUser() {
    this._fb.getUser(this._ConstantsService.getUser().token).subscribe(
      user => this.user = user
    );
   
  }
  
  configTela(width: number, height: number) {
    if (width <= 575) {
      if (this.typeAccess.type == 'default') {
        this.typeAccess = {type: 'mobile', action: 'home'};
      }
    }
    else this.typeAccess.type = 'default';
    this.sizePhoto = height * 0.065
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
