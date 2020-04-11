import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// import 'firebase/firestore';
import { auth } from 'firebase';
import { User } from '../interface/user';
import { RegisterConversation } from '../interface/registerConversation';
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
  
  userAccess(email: string, password: string): Observable<User> | Observable<Object> {
    return new Observable<Object>(subscriber => { 
      auth().signInWithEmailAndPassword(email, password)
      .then(
        response => { 
          if (response['user']) {
            subscriber.next({
              email: response['user']['email'],
              nickname: response['user']['displayName'],
              token: response['user']['uid']
            } as User );
          }
          else subscriber.next(response)
        }
      )
      .catch(error => { subscriber.next({'error': error['message']} as Object)
        
      })
    })
  }
 
  // startedChat(user: string){
  //   this._db.chatToken(user).subscribe(
  //     response => {
  //       this._fb.collection('chats').doc(
  //         response['chat'] +'/conversations/' + this._fb.createId()).set(
  //           {
  //           email: this._ConstantsService.getUser()['email'],
  //           msg: "Salvee",
  //           "datetime": firestore.Timestamp
  //         })
  //      },
  //     error => console.log(error)
  //   );
  // }

  // sendMessageToUser(email: string): Observable<Object> {
  //   return new Observable<Object>(subscriber => {
  //     this._db.chatToken(email).subscribe(
  //       tokenChat => {
  //         this._fb.collection('chats/'+ tokenChat['chat']+'/conversations').valueChanges().subscribe(
  //           () => subscriber.next(tokenChat) 
  //         );
  //       }
  //     );
  //   });
  // }

  getUrlApiDatabase(): Observable<{url: string}> {
    return new Observable<{url: string}>(subscriber => {
      this._fb.collection('parameters').valueChanges().subscribe(
        response => subscriber.next({url: response[0]['url']})
      );
    });
  }

  getConversations(tokenChat: string): Observable<{msgs: Array<Messaging>, token: string}> {
    return new Observable<{msgs: Array<Messaging>, token: string}>(subscriber => {
      this._fb.collection('chats/'+ tokenChat +'/conversations', ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.orderBy('datetime')
        return query
      }).valueChanges()
        .subscribe(
          response => subscriber.next({ msgs: response as Array<Messaging>, token: tokenChat}),
          error => console.log(error)
        );
      }
    );
  }

  setConversations(tokenChat: string, msg: string) {
    this._fb.collection('chats/'+ tokenChat +'/conversations').doc(
        this._fb.createId()).set({
          email: this._ConstantsService.getUser()['email'],
          nickname: this._ConstantsService.getUser()['nickname'],
          msg: msg,
          datetime: firestore.Timestamp.now()
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
          error => console.log(error)
        );
      }
    );
  }

  getConversationsWithUsers(id: string): Observable<Array<RegisterConversation>> {
    return new Observable<Array<RegisterConversation>>(subscriber => {
      this._fb.collection('parameters/conversations_of_users/' + id, ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.orderBy('last_conversation_at')
        return query
      }).valueChanges().subscribe(
          response => subscriber.next(response as Array<RegisterConversation>),
          error => console.log(error)
        );
      }
    );
  }

  setChatGlobal(msg: string) {
    this._fb.collection('chats/global_KxgIWLs7yQ105bOxpq9j/conversations').doc(
        this._fb.createId()).set({
          email: this._ConstantsService.getUser()['email'],
          nickname: this._ConstantsService.getUser()['nickname'],
          msg: msg,
          "datetime": firestore.Timestamp.now()
        });
  }

  getUsers(): Observable<Array<User>> {
    return new Observable<Array<User>>(subscriber => {
      this._fb.collection('users').valueChanges().subscribe(
        users => {
          let name_users: Array<User> = [];
          users.forEach((user: User) => {
            if (user['email'] != this._ConstantsService.getUser()['email'])
              name_users.push(user)
          });
          subscriber.next(name_users);
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
