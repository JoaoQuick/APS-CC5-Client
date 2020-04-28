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
    // this.heightHeaders = this.ajusteSize2(window.innerHeight, 0.08);
  }

  // ajusteSize(height) {
  //   if (height >= 0 && height <= 524)
  //     return height * 0.55;
  //   if (height >= 525 && height <= 594)
  //     return height * 0.58;
  //   if (height >= 0 && height <= 594)
  //     return height * 0.58;
  //   if (height >= 595 && height <= 649)
  //     return height * 0.62;
  //   if (height >= 650 && height <= 693)
  //     return height * 0.65;
  //   if (height >= 694 && height <= 775)
  //     return height * 0.668;
  //   if (height >= 776 && height <= 797)
  //     return height * 0.69;
  //   if (height >= 798 && height <= 900)
  //     return height * 0.695;
  //   if (height > 900 && height < 1000)
  //     return height * 0.71;
  //   if (height >= 1000)
  //     return height * 0.73;
  //   else return height * 0.70;
  // }
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