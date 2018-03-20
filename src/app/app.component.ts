import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard, StatusBar } from 'ionic-native';
import firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    private database: AngularFireDatabase,
    private auth: AuthService,
    private user: UserService
  ) {
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        this.user.retrieveUser(userAuth.uid).subscribe(userData => {
          if (!!userData.houseId) {
            this.user.houseId = userData.houseId;
            this.database.object<any>('/houses/' + userData.houseId)
              .valueChanges().subscribe(houseDetails => {
                this.user.houseName = houseDetails.name;
              });
            console.log('User has list');
            this.rootPage = TabsPage;
          } else {
            this.rootPage = LoginPage;
          }
        });
      } else {
        // Code for testing on web
        if (!platform.is('cordova')) {
          this.user.retrieveUser().subscribe(userData => {
            this.user.houseId = userData.houseId;
            this.database.object<any>('/houses/' + userData.houseId)
              .valueChanges().subscribe(houseDetails => {
                this.user.houseName = houseDetails.name;
              });
            this.rootPage = TabsPage;
          });
        }
        else this.rootPage = LoginPage;
      }
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Keyboard.disableScroll(true);
      StatusBar.styleDefault();
      splashScreen.hide();
    });


    // firebase.initializeApp({
    //   apiKey: "AIzaSyCv3jGkZ-dELU3NGrw04096u8ijZwdOdE0",
    //   authDomain: "projecthousemate.firebaseapp.com",
    //   databaseURL: "https://projecthousemate.firebaseio.com",
    //   storageBucket: "projecthousemate.appspot.com",
    //   messagingSenderId: "975050526675"
    // });

  }
}
