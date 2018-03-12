import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseDetailsModal } from './house-details-modal';

@NgModule({
  declarations: [
    HouseDetailsModal,
  ],
  imports: [
    IonicPageModule.forChild(HouseDetailsModal),
  ],
  exports: [
    HouseDetailsModal
  ]
})
export class HouseDetailsModalModule {}
