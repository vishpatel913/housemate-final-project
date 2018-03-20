import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';
import { AuthService } from "./auth.service"


@Injectable()
export class UserService {

  private user;
  _houseId;

  constructor(
    private database: AngularFireDatabase,
    private auth: AuthService
  ) {
    
  }

  get userId() {
    return this.auth.currentUserId;
  }

  get houseId() {
    return this._houseId;
  }

  set houseId(value: string) {
    this._houseId = value;
  }

  retrieveUser(id: string = this.userId) {
    this.user = this.database.object('/users/' + id)
      .valueChanges();
      // .publishReplay(1)
      // .refCount();
    return this.user;
  }

}
