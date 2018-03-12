import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { HouseDetailsPage } from '../house-details/house-details';
import { CreatePage } from '../create/create';

@IonicPage()
@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'

})

export class TabsPage {
	tabHomeRoot: any = HomePage;
	tabHouseDetailsRoot: any = HouseDetailsPage;
	tabTestRoot: any = CreatePage;

	constructor() {
		
	}
}
