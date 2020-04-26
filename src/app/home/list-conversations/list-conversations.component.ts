import { Component, OnInit, ViewChild, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService }  from '../../services/firebase.service';
import { ConstantsService }  from '../../services/constants.service';
import { RegisterConversation } from '../../interface/registerConversation';
import { EventsCommunicationsService }  from '../../services/events-communications.service';
import { User }                         from '../../interface/user';

@Component({
  selector: 'app-list-conversations',
  templateUrl: './list-conversations.component.html',
  styleUrls: ['./list-conversations.component.scss']
})
export class ListConversationsComponent implements OnInit {

  registerConversations: Array<RegisterConversation>;
  heightScroll: number;
  @Input() typeAccess: {
    type: string,
    action?: string
  };
  @Output() eventShowChat = new EventEmitter<{user: RegisterConversation, action: string}>();
  profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1'
  
  constructor(
    private _fb: FirebaseService,
    private _eventComunication: EventsCommunicationsService,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    this.onResize('');
    this.getConversationsWithUsers();
  }
  
  getConversationsWithUsers() {
    this._fb.getConversationsWithUsers(
      this._ConstantsService.getUser()['token']
    ).subscribe(
      response =>  this.registerConversations = response,
      erro => console.log(erro),
    ) 
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize(window.innerHeight, 0.75);
  }
  
  ajusteSize(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }

  selectUsers(register: RegisterConversation ) {
    if (this.typeAccess.type == 'mobile')
      this.eventShowChat.emit({user: register, action: 'conversations'});
    if (this.typeAccess.type == 'default')
      this._eventComunication.initConversationUser.emit(register);
  }

}
