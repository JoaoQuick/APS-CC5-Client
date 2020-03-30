import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Messaging } from '../interface/messagin';

@Component({
  selector: 'app-chat-global',
  templateUrl: './chat-global.component.html',
  styleUrls: ['./chat-global.component.scss']
})
export class ChatGlobalComponent implements OnInit {

  msg: Array<Messaging>;
  messaging: string;
  globalMessaging;
  constructor(
    private _fb: FirebaseService
  ) { }
  users: Array<string> = ['joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla', 'joajo', 'maria', 'Carla']
  ngOnInit() {
    this.teste()
    // this.submitMessaging('salvee')
  }

  submitMessaging() {
    this._fb.setChatGlobal(this.messaging);
    this.messaging = '';
  }

  teste() {
    this._fb.getChatGlobal().subscribe(
      messaging => {
        this.globalMessaging = messaging;
        console.log('oi')
        console.log(this.globalMessaging)
      })
    }
  
}
