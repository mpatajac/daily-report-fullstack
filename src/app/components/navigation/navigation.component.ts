import { Component, OnInit } from '@angular/core';

import { User } from "../../common/models/user";

import { UserService } from "../../common/services/user.service";
import { MessengerService } from "../../common/services/messenger.service";
import { ThemeService } from "../../common/services/theme.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  user: User;
  
  constructor(
    private userService: UserService,
    private messenger: MessengerService,
    private themeService: ThemeService
  ) { }

  async ngOnInit() {
    this.user = await this.userService.getUser();
  }

  async logout() {
    this.messenger.hideNavigation();
    this.themeService.removeTheme(this.user.darkTheme);
    await this.userService.logout();
  }
}
