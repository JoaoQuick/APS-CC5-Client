import { Component, OnInit, ViewChild, HostListener,
          Input, Output, EventEmitter }                  from '@angular/core';
import { FirebaseService }                               from '../../../services/firebase.service';
import { Messaging }                                     from '../../../interfaces/messagin';
import { User }                                          from '../../../interfaces/user';
import { ConstantsService }                              from '../../../services/constants.service';
import { CdkVirtualScrollViewport }                      from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat-global',
  templateUrl: './chat-global.component.html',
  styleUrls: ['./chat-global.component.scss']
})
export class ChatGlobalComponent implements OnInit {

  inputMessaging: string;
  globalMessaging: Array<Messaging>;
  myUser: User;
  heightScroll: number;
  // heightHeaders: number;
  showSpinner: boolean = true;
  @Output() eventReturnHome = new EventEmitter<string>();
  @Input() typeAccess: {type: string, action?: string };
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  constructor(
    private _fb: FirebaseService,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    this.myUser = this._ConstantsService.getUser();
    this.messagignsChatGlobal();
    this.onResize('');
  }

  submitMessaging() {
    this._fb.setChatGlobal(this.inputMessaging);
    this.inputMessaging = '';
  }

  messagignsChatGlobal() {
    this._fb.getChatGlobal().subscribe(
      messaging => {
        this.globalMessaging = messaging;
        this.teste();
      });
    }
  
  teste() {
    setTimeout(() => {
      this.viewport.scrollToIndex(4999, 'smooth');
    },20);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.heightScroll = this.ajusteSize(window.innerHeight, 0.70);
  }

  ajusteSize(height: number, percentage?: number) {
    if (this.typeAccess['type'] == 'mobile') {
      return height * 0.67
    }
    return height * percentage
  }

  ajusteSize2(height: number, percentage?: number) {
    return height * percentage
  }

  detroyChat(access: string) {
    this.eventReturnHome.emit(access);
  }
}