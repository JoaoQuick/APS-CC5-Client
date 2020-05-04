import { Component, OnInit, Input, ViewChild,
        OnDestroy, Output, EventEmitter,}      from '@angular/core';
import { FirebaseService }                     from '../../../services/firebase.service';
import { Messaging }                           from '../../../interfaces/messagin';
import { User }                                from '../../../interfaces/user';
import { EventsCommunicationsService }         from '../../../services/events-communications.service';
import { UsersHttpService }                    from '../../../services/users-http.service';
import { CdkVirtualScrollViewport }            from '@angular/cdk/scrolling';
import { ConstantsService }                    from '../../../services/constants.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    private _fb: FirebaseService,
    private _db: UsersHttpService,
    private _event: EventsCommunicationsService,
    private _ConstantsService: ConstantsService
  ) { 
    this.getUserToConversation();
    this.getUserToConversationExistent()
  }

  public messages_sent: number;
  public messaging: string;
  public chatToken: string;
  public chatToUsers: User;
  public msgs: Array<Messaging>;
  public myUser: User;
  public showSpinner: boolean = true;
  private chatSubscriber: Subscription;
  private getUserToConversationSubscriber: Subscription;
  private getUserToConversationExistentSubscriber: Subscription;
  private checkPendingNotificationSubscriber: Subscription;
  private restartTalkToNewUserSubscriber: Subscription;
  public profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1'
  @Input() typeAccess: {type: string, action?: string};
  @Input() userConversation: {user: any, action: string};
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;
  @Output() eventReturn = new EventEmitter<string>();

  ngOnInit() {
    this.myUser = this._ConstantsService.getUser();
    this.initComponentMobileOrTablet();
    this.restartTalkToNewUser();
  } 

  ngOnDestroy() {
    this.chatSubscriber.unsubscribe();
    this.getUserToConversationSubscriber.unsubscribe();
    this.getUserToConversationExistentSubscriber.unsubscribe();
    this.checkPendingNotificationSubscriber.unsubscribe();
    this.restartTalkToNewUserSubscriber.unsubscribe();
  }

  initComponentMobileOrTablet() {
    if (this.typeAccess && this.typeAccess.type != 'default') {
      if (this.userConversation.action == 'listUsers' && this.detroyChat()) {
        this.chatToUsers = this.userConversation.user;
        this._db.chatToken(this.userConversation.user).subscribe(
          chatToken => {
            this.chatToken = chatToken['chat'];
            this.messagingChat();
          }
        );
      }

      if (this.userConversation.action == 'conversations' && this.detroyChat()) {
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

  restartTalkToNewUser() {
    this.restartTalkToNewUserSubscriber = this._event.initConversationMobile.subscribe(
      userConversation => {
        this.userConversation = userConversation;
        console.log(this.userConversation);
        this.initComponentMobileOrTablet();
      }
    )
  }

  submitMessaging() {
    if (!(this.messaging == undefined || this.messaging.trim().length == 0)) {
      if (this.chatToken != undefined) {
        this._fb.setConversations(this.chatToken, this.messaging.split('\n').join('<br/>'));
        this.messaging = '';
        if (this.chatToUsers.token.split('.')[1] == undefined) {
          this._db.notifyMessageSending(this.chatToUsers.token);
        }
        else {
          this._db.notifyMessageSending(this.chatToUsers.token.split('.')[1]);
        }
      }
    }
  }

  messagingChat() {
    this.chatSubscriber = this._fb.getConversations(this.chatToken).subscribe(
      response => {
        if (response.token == this.chatToken)
          this.msgs = response.msgs;
        setTimeout(() => {
          this.viewport.scrollToIndex(999999, 'smooth');
        },1)
        console.log('this.myUser.token, this.chatToUsers.toke')
        console.log(this.myUser.token)
        console.log(this.chatToUsers.token)
        this.removeNotify(this.myUser.token, this.chatToUsers.token)
      }
    );
  }

  removeNotify(user_id: string, user_id_two: string) {
    console.log('removeNotify');
    this.checkPendingNotificationSubscriber = this._fb.checkPendingNotification(user_id, user_id_two).subscribe(
      removeNotify => {
        console.log(removeNotify)
        if (removeNotify) {
          if (this.chatToUsers.token.split('.')[1] == undefined) {
            this._db.removeNotifyMessageSending(this.chatToUsers.token);
          }
          else 
            this._db.removeNotifyMessageSending(this.chatToUsers.token.split('.')[1]);
        }
      }
    );
  }

  getUserToConversation() {
    this.getUserToConversationSubscriber = this._event.initConversationToNewUser.subscribe(
      user => {
        console.log('user')
        console.log(user)
        if (this.detroyChat()) {
          this.chatToUsers = {
            nickname: user['nickname'], 
            email: user['email'],
            token: user['token'].split('.')[1],
            profile_photo: user['profile_photo']
          }
          this._db.chatToken(user).subscribe(
            chatToken => {
              this.chatToken = chatToken['chat'];
              this.messagingChat();
            }
          );
        }
      }
    );
  }
  
  getUserToConversationExistent() {
    this.getUserToConversationExistentSubscriber = this._event.initConversationUser.subscribe(
      register => {
        if (this.detroyChat()) {
          this.chatToUsers = {
            nickname: register['nickname'], 
            email: register['user'],
            token: register['uid_user'],
            profile_photo: register['profile_photo']
          }
          this.chatToken = register['chat'];
          this.messages_sent = register['messages_sent'];
          this.messagingChat();
        }        
      });            
  }
 
  ajusteSize2(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }

  detroyChat(): boolean {
    this.chatToUsers = undefined;
    this.msgs = undefined;
    if (this.chatSubscriber)
      this.chatSubscriber.unsubscribe();
    if (this.checkPendingNotificationSubscriber)
      this.checkPendingNotificationSubscriber.unsubscribe();
    return true
  }

  returnHomeMobile() {
    this.chatToUsers = undefined;
    this.msgs = undefined;
    if (this.chatSubscriber)
      this.chatSubscriber.unsubscribe();
    if (this.checkPendingNotificationSubscriber)
      this.checkPendingNotificationSubscriber.unsubscribe();
    if (this.typeAccess && this.typeAccess.type == 'mobile') {
      this.eventReturn.emit('home');
    }
    if (this.typeAccess && this.typeAccess.type == 'tablet') {
      this.eventReturn.emit('chat-global');
    }
  }
}
