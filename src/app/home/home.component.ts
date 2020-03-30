import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Messaging } from '../interface/messagin';
import { User } from '../interface/user';

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
  constructor(
    private _fb: FirebaseService
  ) { }
  users: Array<User>;
  ngOnInit() {
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
    if (this.chatToUsers.length < 1) {
      this.showChat = false;
      this.chatToUsers.push(user);
      this.showChat = true;
    } 
    else {
      this.showChat = false;
      this.chatToUsers.splice(0,1);
      this.chatToUsers.push(user);
      this.showChat = true;
    };
   
    console.log(this.chatToUsers)
  }
}
