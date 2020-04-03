import { Injectable }     from '@angular/core';
import { EventEmitter }   from '@angular/core';
import { User }           from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class EventsCommunicationsService {

  constructor() { }

  initConversationToNewUser = new EventEmitter<User>();

  newConversation(user: User) {
    this.initConversationToNewUser.emit(user);
  }
}
