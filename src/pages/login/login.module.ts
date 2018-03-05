import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import firebase from "firebase";


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
