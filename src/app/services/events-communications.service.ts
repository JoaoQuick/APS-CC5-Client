import { Injectable }     from '@angular/core';
import { EventEmitter }   from '@angular/core';
import { User }           from '../interface/user';
import { RegisterConversation }           from '../interface/registerConversation';

@Injectable({
  providedIn: 'root'
})
export class EventsCommunicationsService {

  initConversationToNewUser = new EventEmitter<User>();
  initConversationUser = new EventEmitter<RegisterConversation>();

  constructor() { } 

  newConversation(user: User) {
    this.initConversationToNewUser.emit(user);
  }
}
