import { Component, OnInit, 
        HostListener, ViewChild }       from '@angular/core';
import { User }                         from '../../interface/user';
import { FirebaseService }              from '../../services/firebase.service';
import { EventsCommunicationsService }  from '../../services/events-communications.service';
import { CdkVirtualScrollViewport }     from '@angular/cdk/scrolling';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: Array<User>;
  heightScroll: number;

  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  constructor(
    private _fb: FirebaseService,
    private _eventComunicarion: EventsCommunicationsService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.onResize('');
  }

  getUsers() {
    this._fb.getUsers().subscribe(
      users => this.users = users
    )
  }

  selectUsers(user: User) {
    this._eventComunicarion.initConversationToNewUser.emit(user);
  }

  teste() {
    setTimeout(() => {
      this.viewport.scrollToIndex(4999, 'smooth');
    },20);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize2(window.innerHeight, 0.70);
    // this.heightHeaders = this.ajusteSize2(window.innerHeight, 0.025);
  }

  // ajusteSize(height) {
  //   if (height >= 0 && height <= 524)
  //     return height * 0.30;
  //   if (height >= 525 && height <= 594)
  //     return height * 0.30;
  //   if (height >= 0 && height <= 594)
  //     return height * 0.30;
  //   if (height >= 595 && height <= 649)
  //     return height * 0.30;
  //   if (height >= 650 && height <= 693)
  //     return height * 0.30;
  //   if (height >= 694 && height <= 775)
  //     return height * 0.30;
  //   if (height >= 776 && height <= 797)
  //     return height * 0.30;
  //   if (height >= 798 && height <= 900)
  //     return height * 0.82;
  //   if (height > 900 && height < 1000)
  //     return height * 0.70;
  //   if (height >= 1000)
  //     return height * 0.70;
  //   else return height * 0.70;
  // }

  ajusteSize2(height: number, percentage: number) {
    let newHeight: number = height * percentage
    return newHeight
  }
}