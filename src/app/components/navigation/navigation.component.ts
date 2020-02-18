import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
