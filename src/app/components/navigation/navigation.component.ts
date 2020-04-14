import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../common/services/messenger.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // TODO: get user from base
  user = {
    name: "matija"
  }

  constructor(private messenger: MessengerService) { }

  ngOnInit() {
  }

  swapTheme() {
    const toggle = document.getElementById("navigation-theme");
    const body = document.body;

    body.classList.toggle("dark");
    body.classList.toggle("light");
  }
}
