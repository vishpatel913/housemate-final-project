import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import { FCM } from '@ionic-native/fcm';
import firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
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
    statusBar: StatusBar,
    private database: AngularFireDatabase,
    // private fcm: FCM,
    private auth: AuthService,
    private user: UserService,
    private notification: NotificationService
  ) {
    firebase.auth().onAuthStateChanged(userAuth => {
      if (userAuth) {
        this.user.retrieveUser(userAuth.uid).subscribe(userData => {
          if (!!userData.houseId) {
            this.user.houseId = userData.houseId;
            this.notification.subscribeToHouse(userData.houseId);
            this.database.object<any>('/houses/' + userData.houseId)
              .valueChanges().subscribe(houseDetails => {
                this.user.houseName = houseDetails.name;
              });
            this.rootPage = TabsPage;
            splashScreen.hide();
          } else {
            this.rootPage = LoginPage;
            splashScreen.hide();
          }
        });
      } else {
        // Testing code for running on web
        if (!platform.is('cordova')) {
          this.user.retrieveUser().subscribe(userData => {
            this.user.houseId = userData.houseId;
            this.database.object<any>('/houses/' + userData.houseId)
              .valueChanges().subscribe(houseDetails => {
                this.user.houseName = houseDetails.name;
              });
            this.rootPage = TabsPage;
            splashScreen.hide();
          });
        }
        // End of testing code
        else {
          this.rootPage = LoginPage;
          splashScreen.hide();
        }
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Keyboard.disableScroll(true);
      statusBar.styleBlackTranslucent();
      statusBar.backgroundColorByHexString('#462882');

      // Push notifiction service
      if(platform.is('cordova')) notification.handleNotification();

      // splashScreen.hide();

    });

  }
}
