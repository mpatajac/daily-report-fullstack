import { Component, OnInit } from '@angular/core';

import { User } from "../../common/models/user";

import { UserService } from "../../common/services/user.service";
import { MessengerService } from "../../common/services/messenger.service";

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
  ) { }

  ngOnInit() {
    // get user
    this.user = this.userService.getUser();

    // change UI theme (if needed)
    if (this.user.darkTheme) {
        const body = document.body;
        body.classList.remove("light");
        body.classList.add("dark");
    }
  }

  swapTheme() {
    const body = document.body;

    body.classList.toggle("dark");
    body.classList.toggle("light");
    this.user.darkTheme = !this.user.darkTheme;
  }
}
