import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from 'ionic-native';
import { Facebook } from '@ionic-native/facebook';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { AuthService } from "../services/auth.service"
import { UserService } from "../services/user.service"

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AddUserPage } from '../pages/add-user/add-user';
import { LoginPage } from '../pages/login/login';
import { CreatePage } from '../pages/create/create';
import { HouseDetailsPage } from '../pages/house-details/house-details';
import { TaskItemComponent } from '../components/task-item/task-item';


export const firebaseConfig = {
  apiKey: 'AIzaSyCv3jGkZ-dELU3NGrw04096u8ijZwdOdE0',
  authDomain: 'projecthousemate.firebaseapp.com',
  databaseURL: 'https://projecthousemate.firebaseio.com',
  storageBucket: 'projecthousemate.appspot.com',
  messagingSenderId: '975050526675'
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CreatePage,
    TabsPage,
    HomePage,
    AddUserPage,
    HouseDetailsPage,
    TaskItemComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxQRCodeModule,
    SuperTabsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    CreatePage,
    TabsPage,
    HomePage,
    AddUserPage,
    HouseDetailsPage,
    TaskItemComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Facebook,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService,
    UserService,
    AngularFireAuthModule,
    BarcodeScanner
  ]
})
export class AppModule { }
