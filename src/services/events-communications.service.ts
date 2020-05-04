import { Injectable }     from '@angular/core';
import { EventEmitter }   from '@angular/core';
import { User }           from '../interfaces/user';
import { RegisterConversation }           from '../interfaces/registerConversation';

@Injectable({
  providedIn: 'root'
})
export class EventsCommunicationsService {

  initConversationToNewUser = new EventEmitter<User>();
  initConversationUser = new EventEmitter<RegisterConversation>();
  initConversationMobile = new EventEmitter<{user: any, action: string}>();

  constructor() { } 

}
