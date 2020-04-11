import { Component, OnInit } from '@angular/core';
import { ConstantsService }  from '../services/constants.service';
import { FirebaseService }  from '../services/firebase.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _ConstantsService: ConstantsService,
    private _fb: FirebaseService
  ) { }

  ngOnInit() {
    this._ConstantsService.ckeckUser();
  }
}
