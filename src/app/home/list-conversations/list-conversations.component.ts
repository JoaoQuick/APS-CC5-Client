import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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

  constructor(
    private _fb: FirebaseService,
    private _eventComunicarion: EventsCommunicationsService,
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
      response => {
        this.registerConversations = response
        console.log(response)
        console.log(response[0]['last_conversation_at'])
      },
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
    this._eventComunicarion.initConversationUser.emit(register);
  }

}
