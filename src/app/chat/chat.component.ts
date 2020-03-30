import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Messaging } from '../interface/messagin';
import { User } from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(
    private _fb: FirebaseService
  ) { }
  messaging: string;
  chatToken: string;
  @Input() globalMessaging: Array<Messaging>;
  @Input() chatToUsers: User;
  ngOnInit() {

  } 

  submitMessaging() {
    // this._fb.setChatGlobal(this.messaging);
    this.messaging = '';
    console.log(this.chatToUsers);
    this.chat();
  }

  chat() {
    this._fb.sendMessageToUser(this.chatToUsers['login']).subscribe(
      token => this.chatToken = token['chat']
    )
  }
}
