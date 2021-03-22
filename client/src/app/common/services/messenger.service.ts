import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  showNavigation: boolean = false;

  constructor() { }

  hideNavigation() {
    this.showNavigation = false;
  }

  switchNavigationVisibility() {
    this.showNavigation = !this.showNavigation;
  }
}
