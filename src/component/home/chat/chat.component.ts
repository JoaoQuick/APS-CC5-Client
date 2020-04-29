import { Component, OnInit, Input, ViewChild,
        HostListener, Output, EventEmitter}    from '@angular/core';
import { FirebaseService }                     from '../../../services/firebase.service';
import { Messaging }                           from '../../../interfaces/messagin';
import { User }                                from '../../../interfaces/user';
import { EventsCommunicationsService }         from '../../../services/events-communications.service';
import { UsersHttpService }                    from '../../../services/users-http.service';
import { CdkVirtualScrollViewport }            from '@angular/cdk/scrolling';
import { ConstantsService }                    from '../../../services/constants.service';

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
  messages_sent: number;
  chatSubscriber: any;
  messaging: string;
  chatToken: string;
  chatToUsers: User;
  msgs: Array<Messaging>;
  myUser: User;
  heightScroll: number;
  sizeTextarea: number;
  showSpinner: boolean = true;
  sizeText: number
  @Input() typeAccess: {type: string, action?: string};
  profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1'
  @Input() userConversation: {user: any, action: string};
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;
  @Output() eventReturn = new EventEmitter<string>();

  ngOnInit() {
    this.myUser = this._ConstantsService.getUser();
    this.onResize('');
    this.setChatTokenIfAccessMobile()
  } 

  setChatTokenIfAccessMobile() {
    if (this.typeAccess && this.typeAccess.type != 'default') {
      if (this.userConversation.action == 'listUsers') {
        this.msgs = undefined;
        this.chatToUsers = this.userConversation.user;
        this._db.chatToken(this.userConversation.user).subscribe(
          chatToken => {
            this.chatToken = chatToken['chat'];
            this.messagingChat();
          }
        );
      }

      if (this.userConversation.action == 'conversations') {
        this.msgs = undefined;
        this.chatToUsers = {
          nickname: this.userConversation.user['nickname'], 
          email: this.userConversation.user['user'],
          token: this.userConversation.user['uid_user'], 
          profile_photo: this.userConversation.user['profile_photo']
        }
        this.chatToken = this.userConversation.user['chat'];
        this.messagingChat();
      }
    }
  }

  submitMessaging() {
    if (!(this.messaging == undefined || this.messaging.trim().length == 0)) {
      this._fb.setConversations(this.chatToken, this.messaging);
      if (this.chatToUsers.token.split('.')[1] == undefined) {
        this._db.notifyMessageSending(this.chatToUsers.token);
      }
      else {
        this._db.notifyMessageSending(this.chatToUsers.token.split('.')[1])
      }
        
    }
    this.messaging = '';
  }

  messagingChat() {
    this.chatSubscriber = this._fb.getConversations(this.chatToken).subscribe(
      response => {
        if (response.token == this.chatToken)
          this.msgs = response.msgs;
        setTimeout(() => {
          this.viewport.scrollToIndex(999999, 'smooth');
        },1);
        this.removeNotify(response.msgs.length);
      }
    );
  }

  removeNotify(lenMessage: number) {
    if (lenMessage > 0) {
      if (this.chatToUsers.token.split('.')[1] == undefined) {
        this._db.removeNotifyMessageSending(this.chatToUsers.token);
      }
      else {
        this._db.removeNotifyMessageSending(this.chatToUsers.token.split('.')[1]);
      }
    }
  }

  getUserToConversation() {
    this._eventCommunication.initConversationToNewUser.subscribe(
      user => {
        this.msgs = undefined;
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
  
  checkSubscribMessage() {
    if (this.chatSubscriber != undefined){
      this.chatSubscriber.unsubscribe()
    }
  }

  getUserToConversationExistent() {
    this._eventCommunication.initConversationUser.subscribe(
      register => {
        this.msgs = undefined;
        this.chatToUsers = {
          nickname: register['nickname'], 
          email: register['user'],
          token: register['uid_user'],
          profile_photo: register['profile_photo']
        }
        this.chatToken = register['chat'];
        this.messages_sent = register['messages_sent']
        this.messagingChat();
      });            
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize(window.innerHeight);
    this.sizeTextarea = window.innerHeight * 0.10
    this.sizeText = window.innerWidth * 0.72
  }

  ajusteSize(height) {
    if (this.typeAccess['type'] == 'mobile') {
      return height * 0.64;
    }
    else if (this.typeAccess['type'] == 'tablet') {
      return height * 0.67;
    }
    else {
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
  }
 
  ajusteSize2(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }

  detroyChat() {
    this.chatToUsers = undefined;
    this.chatSubscriber.unsubscribe()
    if (this.typeAccess && this.typeAccess.type == 'mobile') {
      this.eventReturn.emit('home');
    }
    if (this.typeAccess && this.typeAccess.type == 'tablet') {
      this.eventReturn.emit('chat-global');
    }
  }
}
