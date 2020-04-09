import { Component, OnInit, ViewChild, HostListener }    from '@angular/core';
import { FirebaseService }                               from '../services/firebase.service';
import { Messaging }                                     from '../interface/messagin';
import { User }                                          from '../interface/user';
import { EventsCommunicationsService }                   from '../services/events-communications.service';
import { ConstantsService }                              from '../services/constants.service';
import { CdkVirtualScrollViewport }                      from '@angular/cdk/scrolling';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  msg: Array<Messaging>;
  messaging: string;
  chatToUsers: Array<User> = [];
  globalMessaging: Array<Messaging>;
  showChat: boolean = false;
  users: Array<User>;
  myUser: User;
  heightScroll: number;
  innerWidth: number;
  innerHeight: number;
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  constructor(
    private _fb: FirebaseService,
    private _eventComunicarion: EventsCommunicationsService,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    this._ConstantsService.ckeckUser();
    this.myUser = this._ConstantsService.getUser();
    this.messagignsChatGlobal();
    this.getUsers();
    this.onResize('');
  }

  submitMessaging() {
    this._fb.setChatGlobal(this.messaging);
    this.messaging = '';
  }

  messagignsChatGlobal() {
    this._fb.getChatGlobal().subscribe(
      messaging => {
        this.globalMessaging = messaging;
        this.teste();
      });
    }
  
  teste() {
    setTimeout(() => {
      this.viewport.scrollToIndex(4999, 'smooth');
    },20);
  }
  getUsers() {
    this._fb.getUsers().subscribe(
      users => this.users = users
    )
  }

  selectUsers(user: User) {
    this.showChat = true;
    this._eventComunicarion.initConversationToNewUser.emit(user);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize(window.innerHeight);
    console.log(this.heightScroll)
    console.log(typeof(this.heightScroll))
    console.log(window.innerWidth + ' x ' + window.innerHeight)
  }

  ajusteSize(height) {
    if (height >= 0 && height <= 524)
      return height * 0.55;
    if (height >= 525 && height <= 594)
      return height * 0.58;
    if (height >= 0 && height <= 594)
      return height * 0.58;
    if (height >= 595 && height <= 649)
      return height * 0.62;
    if (height >= 650 && height <= 693)
      return height * 0.65;
    if (height >= 694 && height <= 775)
      return height * 0.668;
    if (height >= 776 && height <= 797)
      return height * 0.69;
    if (height >= 798 && height <= 900)
      return height * 0.695
    if (height > 900 && height < 1000)
      return height * 0.71
    if (height >= 1000)
      return height * 0.73
    else return height * 0.70;
  }
}
