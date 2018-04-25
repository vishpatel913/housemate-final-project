import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
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

  // Returns current user ID
  get id(): string {
    return this.auth.currentUserId;
  }

  // Returns current user first and last names
  get name(): string {
    let names = this.auth.currentUserName.split(' ');
    let displayName = names[0] + " " + names[names.length-1];
    return displayName;
  }

  // Returns current user profile image url
  get image(): string {
    return this.auth.currentUserPhotoUrl;
  }

  // Returns current user's house ID
  get houseId(): string {
    return this._houseId;
  }

  // Sets current user's house ID
  set houseId(value: string) {
    this._houseId = value;
  }

  // Returns current user's house name
  get houseName(): string {
    return this._houseName;
  }

  // Sets current user's house name
  set houseName(value: string) {
    this._houseName = value;
  }

  // Returns Observable of current user details
  retrieveUser(id: string = this.id) {
    this.user = this.database.object('/users/' + id)
      .valueChanges();
    return this.user;
  }

}
