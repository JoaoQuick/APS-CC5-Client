import { Injectable }                   from '@angular/core';
import { User }                         from  '../interfaces/user';
import { HttpClient, HttpHeaders }      from '@angular/common/http';
import { Observable }                   from 'rxjs';
import { ConstantsService }             from '../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

  constructor(
    private _http: HttpClient,
    private _ConstantsService: ConstantsService
  ) { }

  getUsers(): Observable<Array<string>> {
    return new Observable<Array<string>>(subscriber => {
        const url = this._ConstantsService.getUrl() + '/user';
        this._http.get(url).subscribe(
          response => subscriber.next(response as Array<string>),
          (error) => subscriber.next(error)           
        );
      }
    );
  };

  createUser(user: User): Observable<{status: string, token: string}> {
    if (user.profile_photo == '')
      user.profile_photo = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/profile_photo%2FpersonIcon.png-1587776041416?alt=media&token=6e0fec70-b0f6-4b4f-852c-b5cab2c5cbfc' 
    return new Observable<{status: string, token: string}>(subscriber => {
      const url = this._ConstantsService.getUrl() + '/user';
      this._http.post(url, {user: user, action: 'create'}).subscribe(
        response => subscriber.next(response as {status: string, token: string}),
        erro => subscriber.next(erro as {status: string, token: string}),
        () => subscriber.complete()
      );
    });
  }

  updateUser(user: User): Observable<{status: string}> {
    if (user.profile_photo == '')
      user.profile_photo = 'https://firebasestorage.googleapis.com/v0/b/aps-cc5-communication.appspot.com/o/profile_photo%2FpersonIcon.png-1587776041416?alt=media&token=6e0fec70-b0f6-4b4f-852c-b5cab2c5cbfc' 
    return new Observable<{status: string}>(subscriber => {
      const url = this._ConstantsService.getUrl() + '/user';
      this._http.post(url, {user: user, action: 'update'}).subscribe(
        response => subscriber.next(response as {status: string}),
        erro => subscriber.next(erro as {status: string}),
        () => subscriber.complete()
      );
    });
  }

  chatToken(user: User): Observable<Object> {
    return new Observable<Object>(subscriber => {
      const url = this._ConstantsService.getUrl() + '/user-chats';
      const users = new HttpHeaders({
        'uid': this._ConstantsService.getUser()['token'],
        'my_email': this._ConstantsService.getUser()['email'],
        'uid_of_user': user['token'].split('.')[1],
        'email_of_user': user['email']
      })
      this._http.get(url, {headers: users}).subscribe(
        response => subscriber.next(response),
        error => subscriber.next(error),
        () => subscriber.complete()
      );
    });
  }

  notifyMessageSending(token: string) {
    const url = this._ConstantsService.getUrl() + '/user-chats';
    let params = {
      action: 'notify',
      uid_user: this._ConstantsService.getUser().token,
      uid_another_user: token
    }
    this._http.post(url, params).subscribe();
  }

  removeNotifyMessageSending(token: string) {
    const url = this._ConstantsService.getUrl() + '/user-chats';
    let params = {
      action: 'remove_notify',
      uid_user: this._ConstantsService.getUser().token,
      uid_another_user: token
    }
    this._http.post(url, params).subscribe();
  }
}
