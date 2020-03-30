import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { User } from '../interface/user';
import { UsersHttpService } from '../services/users-http.service'
import { ConstantsService } from '../services/constants.service';
import { Observable, Subscriber } from 'rxjs';
import { Messaging } from '../interface/messagin';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private _fb: AngularFirestore,
    private _db: UsersHttpService,
    private _ConstantsService: ConstantsService,
  ) { }

  startedChat(user: string){
    this._db.chatToken(user).subscribe(
      response => {
        this._fb.collection('chats').doc(
          response['chat'] +'/conversations/' + this._fb.createId()).set(
            {
            login: this._ConstantsService.getUser()['login'],
            msg: "Salvee",
            "datetime": firestore.Timestamp
          })
       },
      error => console.log(error)
    );
  }

  sendMessageToUser(login: string): Observable<Object> {
    return new Observable<Object>(subscriber => {
      this._db.chatToken(login).subscribe(
        tokenChat => {
          this._fb.collection('chats/'+ tokenChat['chat']+'/conversations').valueChanges().subscribe(
            response => subscriber.next(tokenChat) 
          );
        }
      );
    });
  }

  getChatGlobal(): Observable<Array<Messaging>> {
    return new Observable<Array<Messaging>>(subscriber => {
      this._fb.collection('chats/global_KxgIWLs7yQ105bOxpq9j/conversations', ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.orderBy('datetime')
        return query
      }).valueChanges()
        .subscribe(
          response => subscriber.next(response as Array<Messaging>),
          error => console.log(error));
      }
    );
  }

  setChatGlobal(msg: string) {
    this._fb.collection('chats/global_KxgIWLs7yQ105bOxpq9j/conversations').doc(
        this._fb.createId()).set({
          login: this._ConstantsService.getUser()['login'],
          msg: msg,
          "datetime": firestore.Timestamp.now()
        });
  }

  getUsers(): Observable<Array<User>>{
    return new Observable<Array<User>>(subscriber => {
      this._fb.collection('users').valueChanges().subscribe(
        users => {
          let name_users: Array<User> = [];
          users.forEach(
            user => name_users.push({'login': user['login'], 'nickname': user['nickname']}));
          subscriber.next(name_users)
        },
        error => console.log('erro: ' + error)
      );
    });
  }

     // this._fb.collection<User>('chats/FfrMhGgYrRfKmQp2FoJs/conversations').valueChanges().subscribe(response => {
    //   console.log(response)})

  // this._fb.collection('chats/FfrMhGgYrRfKmQp2FoJs/conversations').doc(
  //   'askmnfianfsjafnsj').set({
  //     user: "admin",
  //     msg: "Como está a faculdade men? em?"
  //   })


   // this._fb.collection<User>('chats/FfrMhGgYrRfKmQp2FoJs/conversations').valueChanges().subscribe(response => {
    //   console.log(response)})
  // db.doc<User>('users/jtCQ7Q8dPvWTzM3SMXXD').valueChanges().subscribe(response => {
    //   console.log(response)})

    // db.collection<User>('users/5LfHosQOQunkZI7sarqN/chats').valueChanges().subscribe(response => {
    //   console.log(response)})

    // db.collection<Array<User>>('users/5LfHosQOQunkZI7sarqN/chats').valueChanges().subscribe(response => {
    //   console.log(response)})      
    // this.db.collection('users/5LfHosQOQunkZI7sarqN/chats').doc(this.db.createId()).set({
    //   user: "Eoq",
    //   password: "1478",
    //   msg: "Salve aliado, tudo firmão?"
    // })
}
