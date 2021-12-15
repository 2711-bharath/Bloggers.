import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { GoogleAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appUser$: Observable<AppUser>;

  constructor(
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.appUser$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<AppUser>(`appusers/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  private updateUserData(user) {
    const userRef = this.db.doc(`appusers/${user.uid}`);
    const data = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true });
  }

  async login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
   || this.router.url;
    localStorage.setItem('returnUrl', returnUrl);
    const credential = await this.afAuth.signInWithPopup(new GoogleAuthProvider);
    return this.updateUserData(credential.user);
    }
    async logout() {
    await this.afAuth.signOut().then(() => {
    this.router.navigate(['/']);
    });
  }
}
