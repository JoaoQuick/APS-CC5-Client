import { Injectable }           from '@angular/core';
import { AngularFirestore }     from '@angular/fire/firestore';
import { AngularFireStorage }   from '@angular/fire/storage';
import { auth }                 from 'firebase';
import { User }                 from '../interfaces/user';
import { RegisterConversation } from '../interfaces/registerConversation';
import { ConstantsService }     from '../services/constants.service';
import { Observable }           from 'rxjs';
import { Messaging }            from '../interfaces/messagin';
import { firestore }            from 'firebase';
import {finalize}               from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private _fb: AngularFirestore,
    private storage: AngularFireStorage,
    private _ConstantsService: ConstantsService,
  ) { }

  uploadProfilePhoto(file, path): Observable<string> {
    return new Observable<string>(observer => {
        const task = this.storage.upload(path, file);
        task.snapshotChanges().pipe(finalize(() => {
            this.getDownloadUrl(path).subscribe(
                downloadUrl => {
                    observer.next(downloadUrl);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                });
        })).subscribe();
    });
}

getDownloadUrl(filePath): Observable<string> {
    return new Observable<string>(observer => {
        const fileRef = this.storage.ref(filePath);
        fileRef.getDownloadURL().subscribe(
            url => {
                observer.next(url);
                observer.complete();
            },
            error => {
                observer.error(error);
                observer.complete();
            });
    });
  }

  login(email: string, password: string): Observable<User> | Observable<Object> {
    return new Observable<Object>(subscriber => { 
      auth().signInWithEmailAndPassword(email, password)
      .then(
        response => { 
          if (response['user']) {
            this.getUser(response['user']['uid']).subscribe(
              user => {
              subscriber.next({
                email: response['user']['email'],
                nickname: user.nickname,
                token: response['user']['uid'],
                profile_photo: user.profile_photo,
                phone: user.phone
              } as User );
            });
          }
          else subscriber.next(response);
        }
      )
      .catch(error => subscriber.next({'error': error['message']} as Object));
    });
  }

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

  checkPendingNotification(user_id: string, id_user_two: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      this._fb.collection('parameters/conversations_of_users/' + user_id).doc(
        id_user_two).valueChanges().subscribe(
          response => {
            console.log((response as RegisterConversation).viewed)
            subscriber.next((response as RegisterConversation).viewed)
          },
          error => subscriber.next(error)
        );
    });
  }

  setConversations(tokenChat: string, msg: string) {
    this._fb.collection('chats/'+ tokenChat +'/conversations').doc(this._fb.createId()
    ).set({
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
        return query;
      }).valueChanges().subscribe(
          response => subscriber.next(response as Array<Messaging>),
          error => console.log(error)
        );
    });
  }

  getConversationsWithUsers(id: string): Observable<Array<RegisterConversation>> {
    return new Observable<Array<RegisterConversation>>(subscriber => {
      this._fb.collection('parameters/conversations_of_users/' + id, ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.orderBy('last_conversation_at');
        return query
      }).valueChanges().subscribe(
          response => {
            let usersTalk: Array<RegisterConversation> = []
            response.reverse().forEach(
              userTalk => {
                this.getUser(userTalk['uid_user']).subscribe(
                  user => {
                    let userAux: RegisterConversation = userTalk;
                    (user.profile_photo.length == 0) ? userAux.profile_photo = '' : userAux.profile_photo = user.profile_photo;                    
                    usersTalk.push(userAux);
                  }
                );
              }
            );
            subscriber.next(usersTalk as Array<RegisterConversation>);
          },
          error => subscriber.next(error)
        );
      }
    );
  }

  sendMessageToGeneralChat(msg: string) {
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
      this._fb.collection('users', ref => {
        let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.orderBy('nickname');
        return query;
      }).valueChanges().subscribe(
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

  getUser(userId): Observable<User> {
    return new Observable<User>(subscriber => {
      this._fb.collection('users').doc(userId).valueChanges().subscribe(
        user => {
          let token: string = user['token'].split('.')[1];
          user['token'] = token;
          subscriber.next(user)
        }
      );
    });
  }
}
