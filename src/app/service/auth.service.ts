import { Injectable } from '@angular/core';
import { User } from './../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afa: AngularFireAuth
  ) { }

  login(user: User){
    // return this.afa.signInWithEmailAndPassword(user.email, user.password);
    return new Promise( (resolve, reject) => {
      this.afa.signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential: firebase.auth.UserCredential) => {
          if (userCredential.user.emailVerified){
            resolve();
          } else {
            this.logout();
            reject('Seu e-mail ainda não foi verificado. Por favor verifique seu e-mail.');
          }
      })
      .catch((error: any) => {
        reject(error);
      });
    });
  }

  resetPassword(user: User){
    return this.afa.sendPasswordResetEmail(user.email);
  }

  register(user: User){
    // return this.afa.createUserWithEmailAndPassword(user.email, user.password);
    return new Promise((resolve, reject) => {
      this.afa.createUserWithEmailAndPassword(user.email, user.password)
      .then( (userCredential: firebase.auth.UserCredential) => {
        userCredential.user.updateProfile({ displayName: user.name, photoURL: ''});
        userCredential.user.sendEmailVerification();
        this.logout();
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
    });
  }

  logout(){
    return this.afa.signOut();
  }

  getAuth(){
    return this.afa.authState;
  }
}
