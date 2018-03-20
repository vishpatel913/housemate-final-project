import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';
import { AuthService } from "./auth.service"


@Injectable()
export class UserService {

  _houseId: string;
  _houseName: string;
  user

  constructor(
    private database: AngularFireDatabase,
    private auth: AuthService
  ) {

  }

  get id() {
    return this.auth.currentUserId;
  }

  get name() {
    let names = this.auth.currentUserName.split(' ');
    let displayName = names[0] + " " + names[names.length-1];
    return displayName;
  }

  get image() {
    return this.auth.currentUserPhotoUrl;
  }

  get houseId() {
    return this._houseId;
  }

  set houseId(value: string) {
    this._houseId = value;
  }

  get houseName() {
    return this._houseName;
  }

  set houseName(value: string) {
    this._houseName = value;
  }

  retrieveUser(id: string = this.id) {
    this.user = this.database.object('/users/' + id)
      .valueChanges();
      // .publishReplay(1)
      // .refCount();
    return this.user;
  }

}
