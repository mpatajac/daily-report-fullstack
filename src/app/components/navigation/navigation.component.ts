import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../common/services/messenger.service';
import { User } from '../../common/models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // TODO: get user from base
  user: User = {
    id: 1,
    name: "matija",
    password: "1234",
    darkTheme: true,
    showWarning: false
  }

  constructor(private messenger: MessengerService) { }

  ngOnInit() {
    // change theme (if needed)
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
