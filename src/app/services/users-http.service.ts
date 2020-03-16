import { Injectable } from '@angular/core';
import { User } from  '../interface/user';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { ConstantsService } from '../services/constants.service'

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {

  constructor(
    private _http: HttpClient,
    private _ConstantsService: ConstantsService
  ) { }

  getUsers() {
    return new Observable<Array<User>>(
      subscriber => {
        const url = this._ConstantsService.getUrlUser() + '/user';
        // const url = 'https://jsonplaceholder.typicode.com/users';
        this._http.get(url).subscribe(
          (response) => subscriber.next(response as Array<User>),
          (error) => subscriber.next(error)           
        )
      }
    )
  };

  postUser(user: User): Observable<string> {
    return new Observable<string>(subscriber => {
      const url = this._ConstantsService.getUrlUser() + '/user' 
      this._http.post(url, user, {responseType: 'text'}).subscribe(
        (response) => {
          subscriber.next(response)
        },
        // (error) => console.log('error: ' + error)
      );
    });
  }
  
}
