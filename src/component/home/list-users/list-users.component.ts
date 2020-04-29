import { Component, OnInit, HostListener,  
         ViewChild, Input, Output, 
         EventEmitter }                 from '@angular/core';
import { User }                         from '../../../interfaces/user';
import { FirebaseService }              from '../../../services/firebase.service';
import { EventsCommunicationsService }  from '../../../services/events-communications.service';
import { CdkVirtualScrollViewport }     from '@angular/cdk/scrolling';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: Array<User>;
  heightScroll: number;
  profile_photo_default: string = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/system%2FpersonIcon.png?alt=media&token=54455364-9642-423a-bcdf-2335bb03c5f1'
  @Input() typeAccess: {
    type: string,
    action?: string
  };
  @Output() eventShowChat = new EventEmitter<{user: User, action: string}>();
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  constructor(
    private _fb: FirebaseService,
    private _eventComunicarion: EventsCommunicationsService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.onResize('');
  }

  checkIfExist(user: User): boolean {
    if (user.profile_photo == '') 
      return true;
    return false;
  }

  getUsers() {
    this._fb.getUsers().subscribe(
      users => {
        this.users = users
      }
    )
  }

  selectUsers(user: User) {
    if (this.typeAccess.type == 'mobile' || this.typeAccess.type == 'tablet') {
      this.eventShowChat.emit({user: user, action: 'listUsers'});
    }
    else {
      this._eventComunicarion.initConversationToNewUser.emit(user);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize2(window.innerHeight, 0.70);
  }

  ajusteSize2(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }
}