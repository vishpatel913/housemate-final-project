import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseDetailsPage } from './house-details';

@NgModule({
  declarations: [
    HouseDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseDetailsPage),
  ],
})
export class HouseDetailsPageModule {}
