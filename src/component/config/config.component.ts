import { Component, OnInit }  from '@angular/core';
import { ConstantsService }   from '../../services/constants.service';
import { Router }             from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  url: string = '';
  alert: Object = {};
  constructor(
    private router: Router,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
  }

  setUrl() {
    if (this.url != '') {
      this._ConstantsService.setUrl(this.url);
      this.showAlert('Nova url de API configurada!', 'alert-success');
    }
    else {
      this.showAlert('Preencha o campo "url da API"', 'alert-danger');
    }
  }

  showAlert(msg: string, type: string) {
    this.alert = {msg: msg, type: type};
    setTimeout(() => {
      this.alert = false
      this.router.navigate(['/home'])
    }, 2500);
  }
}
