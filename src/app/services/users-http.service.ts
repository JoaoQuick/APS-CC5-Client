import { Injectable } from '@angular/core';
import { User } from  '../interface/user';
import { HttpClient, HttpParams, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { ConstantsService } from '../services/constants.service';
import { Messaging } from '../interface/messagin';

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
        // const url = 'https://jsonplaceholder.typicode.com/users';
        this._http.get(url).subscribe(
          response => {
            console.log(response)
            subscriber.next(response as Array<string>)},
          (error) => subscriber.next(error)           
        )
      }
    )
  };

  registerUser(user: User): Observable<{status: string, token: string}> {
    return new Observable<{status: string, token: string}>(subscriber => {
      const url = this._ConstantsService.getUrl() + '/user' 
      this._http.post(url, user).subscribe(
        response => subscriber.next(response as {status: string, token: string}),
        erro => subscriber.next(erro as {status: string, token: string})
      );
    });
  }
  // return string api: param: {responseType: 'text'}

  checkUserAuthentication(user: User): Observable<string> {
    return new Observable<string>(subscribe => {
      const url = this._ConstantsService.getUrl() + '/user-access';
      const ckeckUser = new HttpHeaders({
        'email': user.email,
        'password': user.password
      })
      this._http.get(url, {headers: ckeckUser}).subscribe(
        response => {
          console.log(response)
          subscribe.next(response as string)},
        erro => subscribe.next(erro)
        // user invalid
      )
    })
  }

  chatToken(email: string): Observable<Object> {
    return new Observable<Object>(subscriber => {
      const url = this._ConstantsService.getUrl() + '/user-chats';
      const users = new HttpHeaders({
        'user_1': this._ConstantsService.getUser()['email'],
        'user_2': email
      })
      this._http.get(url, {headers: users}).subscribe(
        response => subscriber.next(response),
        error => subscriber.next(error)
      );
    });
  }
}
