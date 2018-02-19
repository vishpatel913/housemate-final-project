import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
// import { ListItem } from "../../models/list-item/list-item.interface";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  itemListRef$: AngularFireList<any>;
  // listItems;
  todoItems;
  doneItems;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public facebook: Facebook,
    private database: AngularFireDatabase,
  ) {
    this.itemListRef$ = this.database.list<any>('/itemlist');
  }

  ngOnInit() {
    this.clearOldItems();
    // this.listItems = this.itemListRef$.valueChanges();
    this.todoItems = this.getItems(false).valueChanges();
    this.doneItems = this.getItems(true).valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  getItems(done: boolean) {
    console.log("done items", this.database.list<any>('/itemlist', ref => ref.orderByChild('done').equalTo(done)).valueChanges());
    return this.database.list<any>('/itemlist', ref => ref.orderByChild('done').equalTo(done));
  }

  addItem() {
    let prompt = this.alertCtrl.create({
      title: 'Item Name',
      inputs: [
        {
          name: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.saveItem(data.text)
          }
        }
      ]
    });
    prompt.present();
  }

  saveItem(text: string) {
    const newItemRef = this.itemListRef$.push({});
    newItemRef.set({
      id: newItemRef.key,
      text: text,
      timecreated: Math.floor(Date.now() / 1000),
      done: false
    });
  }

  editItem(item, text: string) {
    this.database.object('/itemlist/' + item.id)
      .update({
        text: text,
        timecreated: Math.floor(Date.now() / 1000),
      });
  }

  deleteItem(item) {
    this.database.object('/itemlist/' + item.id)
      .remove();
  }

  toggleDone(item: any) {
    let timestamp = !item.done ? Math.floor(Date.now() / 1000) : item.timecreated;
    this.database.object('/itemlist/' + item.id)
      .update({
        text: item.text,
        done: !item.done,
        timedone: timestamp
      });
  }

  clearOldItems() {
    let now = Math.floor(Date.now() / 1000);
    if (this.getItems(true).valueChanges()) {
      this.getItems(true).valueChanges()
        .subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            // deletes done items after 3 days
            if (now - snapshot.timedone > 86400 * 3) {
              this.deleteItem(snapshot);
            }
          });
        })
    }
  }


  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
      .then(response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then(success => {
            console.log("Firebase success: " + JSON.stringify(success));
          });

      }).catch((error) => { console.log(error) });
  }

}
