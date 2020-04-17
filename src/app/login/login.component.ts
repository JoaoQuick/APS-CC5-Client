import { Component, OnInit, HostListener }      from '@angular/core';
import { UsersHttpService }       from '../services/users-http.service';
import { User }                   from '../interface/user';
import { ConstantsService }       from '../services/constants.service';
import { FirebaseService }       from '../services/firebase.service';
import { Router }                 from '@angular/router';
import 'firebase/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  user: User = {
    "email": '',
    "password": ''
  };
  registerUser: User = {
    "password": '',
    "nickname": '',
    "email": '',
    "phone": ''
  };
  alert: Object = {};
  loginOrAccess: boolean = true;
  showSpinner: boolean = false;
  typeAccess: {
    type: string,
    action?: string
  } = {
    type: 'default'
  };

  constructor(
    private _users: UsersHttpService,
    private router: Router,
    private _fb: FirebaseService,
    private _ConstantsService: ConstantsService
  ) { }

  ngOnInit() {
    this.onResize('');
    this._fb.getUrlApiDatabase().subscribe(api => {
      this._ConstantsService.setUrl(api.url);
      console.log(api);
    });
  }

  
  userAccess() {
    this.showSpinner = true;
    this._fb.userAccess(this.user['email'], this.user['password']).subscribe(
      response => {
        this.showSpinner = false;
        if (response['email'] && response['token']) {
          this._ConstantsService.setUser(response as User);
          this.showAlert('Login bem sucedido', 'alert-success');
          this.access();
        }
        if (response['error'])
          this.showAlert(response['error'], 'alert-danger', this.registerUser['email'], 'error');
      },
      error => {
        this.showSpinner = false;
        this.showAlert('Ocorreu um erro ao acessar o servidor', 'alert-danger');
      }
    )
  }

  register(returnPageLogin?: string) {
    if (this.loginOrAccess)
      this.loginOrAccess = false;
    else if (returnPageLogin == 'true') {
      this.loginOrAccess = true;
    }
    else this.createUser()
  }

  createUser() {
    this.showSpinner = true;
    if (this.registerUser['email'] != '' && this.registerUser['password'] != '' && (
      this.registerUser['nickname']) != '') {
        this._users.registerUser(this.registerUser).subscribe(
          response => {
            if (response['status'] == 'user created') {
              this._fb.userAccess(this.registerUser['email'], this.registerUser['password']).subscribe(
                response => {
                  if (response['email'] && response['token']) {
                    this.showSpinner = false;
                    this._ConstantsService.setUser(response as User)
                  }
                  this.showAlert('Usuário cadastrado com sucesso', 'alert-success');
                  this.access();
                }
              );
            }
          if (response['status'] == 'error') {
            this.showSpinner = false;
            this.showAlert(response['error'], 'alert-danger', 
                            this.registerUser['email'], response['status']);
            }
          if (response['status'] == '0') {
            this.showSpinner = false;
            this.showAlert('Ocorreu um erro ao acessar o servidor, tente acessar mais tarde.', 'alert-danger');
          }
          },
          () => {
            this.showSpinner = false;
            this.showAlert('Ocorreu um erro ao acessar o servidor', 'alert-danger');
          }
        );
      }
    else  {
      this.showAlert('Preencha todos os campos para registrar-se!', 'alert-danger');
      this.showSpinner = false;
    }
  }

  showAlert(msg: string, type: string, email?: string, status?: string): void {
    let message: string;
    if (status == 'error') {
      switch (msg) {
        case 'format_email_invalid': {
          message = 'Formato do e-mail invalido!';
          break;
        }
        case 'user_alread_created': {
          message = 'Outra conta já está utilizando o e-mail: ' + email + '.';
          break;
        }
        case 'The password is invalid or the user does not have a password.': {
          message = 'Senha incorreta! Tente novamente.';
          break;
        }
        case 'The email address is badly formatted.': {
          message = 'O e-mail fornecido é inválido!';
          break;
        } 
        case 'There is no user record corresponding to this identifier. The user may have been deleted.': {
          message = 'Não há registro de usuário correspondente a esse email.';
          break;
        }
        case 'Too many unsuccessful login attempts. Please try again later.': {
          message = 'Muitas tentativas de login sem êxito. Por favor, tente novamente mais tarde.';
          break;
        }
        case 'password_least_six_characters': {
          message = 'Senha deve possuir no mínimo 6 caracteres';
          break;
        }
        case 'user_not_exists': {
          message = 'Usuário não está cadastrado.';
          break;
        }
        case 'error_request_firebase': {
          message = 'Ocorreu um erro ao verificar sua conta, tente mais tarde.';
          break;
        }
        case 'user_not_found': {
          message = 'Usuário não encontrato, verifique os dados de acesso.';
          break;
        }
        case 'Error while calling Auth service (INVALID_EMAIL).': {
          message = 'E-mail fornecido para login inválido!';
          break;
        }
        default: {
          message = 'Ocorreu o seguinte erro: ' + msg;
        }
      } 
    }
    else 
      message = msg;
    this.alert = {msg: message, type: type};
    setTimeout(() => {
      this.alert = false}, 2500);
  }

  access() {
    setTimeout(() => {
      this.router.navigate(['/home'])
    }, 2500);
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configTela(window.innerWidth, window.innerHeight) ;
  }

  configTela(width: number, height: number) {
    if (width <= 575) {
      this.typeAccess = {type: 'mobile'};
    }
    else {
      this.typeAccess = {type: 'default'};
    }
  }
}
