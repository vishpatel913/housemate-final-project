import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';
import { AuthService } from "./auth.service"


@Injectable()
export class UserService {

  private user: any;

  constructor(
    private database: AngularFireDatabase,
    private auth: AuthService
  ) {

  }

  get userId() {
    return this.auth.currentUserId;
  }

  get houseId() {
    return this.userHouseId;
  }

  retrieveUser() {
    this.user = this.database.object('/users/' + this.userId)
      .valueChanges()
      .publishReplay(1)
      .refCount();
    return this.user;
  }

  addCurrentUser() {
    const newUserRef = this.database.object(`/users/${this.userId}/`);
    newUserRef.update({
      id: this.userId,
      name: this.auth.currentUserName,
      photoURL: this.auth.currentUserPhotoUrl,
    });
  }

}
