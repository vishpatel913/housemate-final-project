import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import { AngularFireDatabase } from "angularfire2/database";
import { UserService } from "./user.service";
import { TaskItem } from "../models/task-item/task-item.interface";

@Injectable()
export class NotificationService {

  constructor(
    private toastCtrl: ToastController,
    private database: AngularFireDatabase,
    private http: HttpClient,
    private fcm: FCM,
    private user: UserService,
  ) {

  }

  subscribeToHouse(id = this.user.houseId) {
    this.fcm.subscribeToTopic(id);
  }

  subscribeToUser() {
    // TODO: subscribe to user and handle so tags send notifications
  }

  unsubscribeFromHouse() {
    this.fcm.unsubscribeFromTopic(this.user.houseId);
  }

  handleNotification() {
    this.fcm.getToken().then(token => {
      console.log('FCM token:', token);
      // handle.registerToken(token);
    });

    this.fcm.onNotification().subscribe(data => {
      this.database.object<any>(`/houses/${this.user.houseId}/users/${data.user}`)
        .valueChanges().subscribe(user => {
          if (this.user.id != data.user) {
            let toast = this.toastCtrl.create({
              message: `New task added by ${user.name.split(' ')[0]}`,
              duration: 2000,
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: 'Hide',
            });
            toast.present();
          }
        });
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('New FCM token:', token);
      // handle.registerToken(token);
    });
  }

  sendHouseNotification(task: TaskItem) {

    let body = {
      "notification": {
        "title": this.user.houseName,
        "body": task.text,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon",
      },
      "data": {
        "text": task.text,
        "user": task.createdby,
      },
      "to": `/topics/${this.user.houseId}`,
      "priority": "high",
      "restricted_package_name": ""
    }
    let options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send", body, {
      headers: options.set('Authorization', 'key=AAAA4wWKT9M:APA91bEMnoNCK0EBgdQil_GEtuW4YGtZ97lxeBAiOMO9PPEl8mJsGB7dB4uxL9XqOaElxufTCsl1lCH4erTwIjSuJ6va0NR7Xluf-zOVGlnwF2fTlOeUdXL_2M6mMWIWsnn7G-X8mWgL'),
    }).subscribe();
    console.log(body);
  }

}
