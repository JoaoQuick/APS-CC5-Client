import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FirebaseService }                     from '../services/firebase.service';
import { Messaging }                           from '../interface/messagin';
import { User }                                from 'firebase';
import { EventsCommunicationsService }         from '../services/events-communications.service';
import { UsersHttpService }                    from '../services/users-http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(
    private _fb: FirebaseService,
    private _db: UsersHttpService,
    private _eventCommunication: EventsCommunicationsService
  ) { 
    this.getUserToConversation();
  }
  messaging: string;
  chatToken: string;
  chatToUsers: User;
  msgs: Array<Messaging>;
  // @Input() globalMessaging: Array<Messaging>;
 
  ngOnInit() {
  } 

  submitMessaging() {
    this._fb.setConversations(this.chatToken, this.messaging);
    this.messaging = '';
  }

  messagingChat() {
    this._fb.getConversations(this.chatToken).subscribe(
      response => {
        console.log(response)
        if (response.token == this.chatToken)
          this.msgs = response.msgs;
      }
    )
  }

  getUserToConversation() {
    this._eventCommunication.initConversationToNewUser.subscribe(
      user => {
        this.chatToUsers = user;
        this._db.chatToken(user['email']).subscribe(
          chatToken => {
            this.chatToken = chatToken['chat'];
            this.messagingChat();
          }
        );
      }
    );
  }
}
