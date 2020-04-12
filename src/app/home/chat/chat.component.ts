import { Component, OnInit, Input, ViewChild,
        HostListener}                          from '@angular/core';
import { FirebaseService }                     from '../../services/firebase.service';
import { Messaging }                           from '../../interface/messagin';
import { User }                                from '../../interface/user';
import { EventsCommunicationsService }         from '../../services/events-communications.service';
import { UsersHttpService }                    from '../../services/users-http.service';
import { CdkVirtualScrollViewport }            from '@angular/cdk/scrolling';
import { ConstantsService }                    from '../../services/constants.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(
    private _fb: FirebaseService,
    private _db: UsersHttpService,
    private _eventCommunication: EventsCommunicationsService,
    private _ConstantsService: ConstantsService
  ) { 
    this.getUserToConversation();
    this.getUserToConversationExistent()
  }
  messaging: string;
  chatToken: string;
  chatToUsers: User;
  msgs: Array<Messaging>;
  myUser: User;
  heightScroll: number;


  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;
  ngOnInit() {
    this.myUser = this._ConstantsService.getUser();
    this.onResize('');
  } 

  submitMessaging() {
    if (!(this.messaging == undefined || this.messaging.trim().length == 0)) {
      this._fb.setConversations(this.chatToken, this.messaging);
      if (this.chatToUsers.token.split('.')[1] == undefined)
        this._db.notifyMessageSending(this.chatToUsers.token);
      else 
        this._db.notifyMessageSending(this.chatToUsers.token.split('.')[1])
    }
      
    this.messaging = '';
  }

  messagingChat() {
    this._fb.getConversations(this.chatToken).subscribe(
      response => {
        if (response.token == this.chatToken)
          this.msgs = response.msgs;
          setTimeout(() => {
            this.viewport.scrollToIndex(response.msgs.length, 'smooth');
          },1);
        if (response.msgs.length > 0) {
          if (this.chatToUsers.token.split('.')[1] == undefined)
          this._db.removeNotifyMessageSending(this.chatToUsers.token);
        else 
          this._db.removeNotifyMessageSending(this.chatToUsers.token.split('.')[1])
        }
      }
    );
  }

  getUserToConversation() {
    this._eventCommunication.initConversationToNewUser.subscribe(
      user => {
        this.chatToUsers = user;
        this._db.chatToken(user).subscribe(
          chatToken => {
            this.chatToken = chatToken['chat'];
            this.messagingChat();
          }
        );
      }
    );
  }
  
  getUserToConversationExistent() {
    this._eventCommunication.initConversationUser.subscribe(
      register => {
        this.chatToUsers = {
          nickname: register['nickname'], email: register['user'],
          token: register['uid_user']
        }
        this.chatToken = register['chat'];
        this.messagingChat();
      });
        // this.chatToUsers = user;
        //     this.chatToken = user['chat'];
            
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize(window.innerHeight);
  }

  ajusteSize(height) {
    if (height >= 0 && height <= 551)
      return height * 0.25;
    if (height >= 551 && height <= 572)
      return height * 0.28;
    if (height >= 572 && height <= 602)
      return height * 0.30;
    if (height >= 603 && height <= 654)
      return height * 0.33;
    if (height >= 655 && height <= 696)
      return height * 0.38;
    if (height >= 697 && height <= 742)
      return height * 0.41;
    if (height >= 743 && height <= 781)
      return height * 0.445;
    if (height >= 782 && height <= 823)
      return height * 0.47;
    if (height >= 824 && height <= 887)
      return height * 0.49;
    if (height >= 888 && height <= 927)
      return height * 0.514;
    if (height >= 928 && height < 1000)
      return height * 0.52;
    if (height >= 1000)
      return height * 0.53;
  }
 
  ajusteSize2(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }

  detroyChat() {
    this.chatToUsers = undefined;
  }
}
