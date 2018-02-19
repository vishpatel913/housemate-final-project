import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from 'ionic-native';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Keyboard.disableScroll(true);
      statusBar.styleDefault();
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
