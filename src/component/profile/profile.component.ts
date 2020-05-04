import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User }                             from '../../interfaces/user';
import { FirebaseService }        from '../../services/firebase.service';
import { UsersHttpService }        from '../../services/users-http.service';
import { ConstantsService }     from '../../services/constants.service';
import { Router }                 from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  alert: any = false;
  textButtonProfile_photo: string = 'Remover foto';
  password: string;
  showSpinner: boolean = false;
  user: User = {
    email: this.userdata.email,
    nickname: this.userdata.nickname,
    token: this.userdata.token,
    profile_photo: this.userdata.profile_photo,
    phone: this.userdata.phone,
  }
  constructor(
    private _fb: FirebaseService,
    private _http: UsersHttpService,
    private router: Router,
    private _ConstantsService: ConstantsService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public userdata: User
  ) { }

  ngOnInit() {
    this.user.password = ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedFile(event) {
    if (this.textButtonProfile_photo == 'Selecione uma nova foto de perfil') {
      const file = event.target.files[0];
      const name = event.target.files[0]['name'];
      this._fb.uploadProfilePhoto(file, 'profile_photo/' + name + '-' + Date.now()).subscribe(
        url => {
          this.user.profile_photo = url
          this.textButtonProfile_photo = 'Remover foto'
        },
        error => console.log(error)
      )
    }
    else {
      this.user.profile_photo = ''
      this.textButtonProfile_photo = 'Selecione uma nova foto de perfil'
    }
  }

  restart() {
    this._ConstantsService.setUser(undefined);
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.dialogRef.close();
    }, 2500);
  }

  updateUser() {
    this.showSpinner = true;
    if (this.user.password == '') { 
      this._http.updateUser(this.user).subscribe(
        response => {
          if (response['status'] == 'update') {
            this.showAlert('Dados alterados', 'alert-success');
            this.showSpinner = false;
          }
        },
        () => {
          this.showSpinner = false}
      );
    }
    else if (this.user.password == this.password) {
      this._http.updateUser(this.user).subscribe(
        response => {
          if (response['status'] && response['status'] == 'update') {
            this.showAlert('Dados alterados. Reiniciando..', 'alert-success');
            this.restart()
          }
          else if (response['error']['status'] && response['error']['status'] == 'error')
            this.showAlert(response['error']['error'], 'alert-danger', 'error');
          this.showSpinner = false;
        },
        () => this.showSpinner = false
      );
    }
    else 
      this.showSpinner = false;
  }   


  showAlert(msg: string, type: string, status?: string): void {
    let message: string;
    if (status == 'error') {
      switch (msg) {
        case 'format_email_invalid': {
          message = 'Formato do e-mail invalido!';
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
}
