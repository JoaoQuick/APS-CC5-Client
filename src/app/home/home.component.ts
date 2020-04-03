import { Component, OnInit, Input }    from '@angular/core';
import { FirebaseService }             from '../services/firebase.service';
import { Messaging }                   from '../interface/messagin';
import { User }                        from '../interface/user';
import { EventsCommunicationsService } from '../services/events-communications.service';
import { ConstantsService }             from '../services/constants.service';

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

  constructor(
    private _fb: FirebaseService,
    private _eventComunicarion: EventsCommunicationsService,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    this._ConstantsService.ckeckUser();
    this.messagignsChatGlobal();
    this.getUsers();
  }

  submitMessaging() {
    this._fb.setChatGlobal(this.messaging);
    this.messaging = '';
  }

  messagignsChatGlobal() {
    this._fb.getChatGlobal().subscribe(
      messaging => {
        this.globalMessaging = messaging;
      })
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
}
