import { HostListener, Component } from '@angular/core';
import { ConstantsService }                    from './services/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client-aps';

  constructor(private _ConstantsService: ConstantsService) { }
  public innerWidth: any;
  public innerHeight: any;
  ngOnInit() {
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

}
