import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPopover } from './settings';

@NgModule({
  declarations: [
    SettingsPopover,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPopover),
  ],
})
export class SettingsPopoverModule {}
