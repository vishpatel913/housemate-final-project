import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemModal } from './item-modal';

@NgModule({
  declarations: [
    ItemModal,
  ],
  imports: [
    IonicPageModule.forChild(ItemModal),
  ],
  exports: [
    ItemModal
  ]
})
export class ItemModalModule {}
