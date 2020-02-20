import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../common/services/messenger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private messenger: MessengerService) { }

  ngOnInit() {
  }

  switchNavigationVisibility() {
    this.messenger.showNavigation = !this.messenger.showNavigation;
  }

  hideNavigation() {
    this.messenger.showNavigation = false;
  }

}
