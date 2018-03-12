import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { UserService } from '../../services/user.service';


@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {

  createdCode: string = null;
  houseName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private user: UserService

  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserPage');
    this.user.retrieveUser().subscribe(user => {
      this.createdCode = user.houseId;
      this.database.object<any>('/houses/' + this.createdCode)
      .valueChanges().subscribe(house => {;
        this.houseName = house.name;
      })
    });
  }

}
