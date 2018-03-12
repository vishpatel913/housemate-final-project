import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard, StatusBar } from 'ionic-native';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AddUserPage } from '../pages/add-user/add-user';
import { LoginPage } from '../pages/login/login';
import { CreatePage } from '../pages/create/create';
import { HouseDetailsPage } from '../pages/house-details/house-details';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    private auth: AuthService,
    private user: UserService
  ) {
    firebase.auth().onAuthStateChanged(userAuth => {
      this.user.retrieveUser(userAuth.uid).subscribe(userData => {
        if (userData !== null) {
          if (!!userData.houseId) {
            console.log('User has list');
            this.rootPage = TabsPage;
          } else {
            this.rootPage = LoginPage;
          }
        } else {
          this.rootPage = LoginPage;
        }
      });
    });

    if (!platform.is('cordova')) {
      this.rootPage = TabsPage;
    }

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
