import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from '../services/users-http.service'
import { User } from '../interface/user';
import { ConstantsService } from '../services/constants.service'
import 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  user: User = {
    "login": '',
    "password": ''
  };
  registerUser: User = {
    "login": '',
    "password": '',
    "nickname": '',
    "email": ''
  }
  alert: Object = {};

  constructor(
    private _users: UsersHttpService,
    private router: Router,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    // this._users.checkUserAuthentication({'login': 'admin', 'password': '11'}).subscribe(response => {
    //   console.log(response)
    // })
    this._users.chatToken('admin').subscribe(response => {
        console.log(response)
      })
  }

  userAccess() {
    this._users.checkUserAuthentication(this.user).subscribe(response => {
      console.log(response)
      
      if (response != 'user invalid') {
        this.user.authenticationToken = response;
        this._ConstantsService.setUser(this.user);
        this.showAlert('Login bem sucedido!', 'alert-success');
        this.access();
      }
      else this.showAlert('Login ou senha inválido!', 'alert-danger')
      })
  }

  register() {
    if (this.registerUser['login'] != '' && this.registerUser['password'] != '' && (
          this.registerUser['nickname']) != '') {
      this._users.registerUser(this.registerUser).subscribe(
        response => {
          if (response != 'user already registered') {
            this.user.authenticationToken = response;
            this.showAlert('Usuário cadastrado com sucesso', 'alert-success');
            this.access();
          }
          else 
          this.showAlert('Usuário já cadastrado', 'alert-danger');
        },
        error => console.log(error)
      );
    }
    else this.showAlert('Login e senha inválidos!', 'alert-danger');
  }

  showAlert(msg: string, type: string): void {
    this.alert = {msg: msg, type: type};
    setTimeout(() => {
      this.alert = false}, 2500);
  }

  access() {
    setTimeout(() => {
      this.router.navigate(['/home'])
    }, 2500);
  }

}
