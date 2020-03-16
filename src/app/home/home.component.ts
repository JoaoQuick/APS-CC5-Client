import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from '../services/users-http.service'
import { User } from '../interface/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _users: UsersHttpService
  ) { }

  user: User = {
    "login": '',
    "password": '',
    "authenticationToken": ''
  }
  

  ngOnInit() { 
  }

  getUsers() {
    this._users.getUsers().subscribe(
      (response) => {
        console.log('Msg: ' + response);
      }
    )
  }

  register() {
    if (this.user['login'] != '' && this.user['password'] != ''){
      this._users.postUser(this.user).subscribe(
        response => {
          console.log('jonson')
          console.log(response)
          if (response != 'user already registered')
            this.user.authenticationToken = response
          else {
            alert('Login já registrado')
          }
        },
        error => console.log('erro: ' + error)
      );
    }
  }

}
