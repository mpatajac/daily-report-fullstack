import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  body: HTMLElement = document.body;

  constructor(private userService: UserService) { }

  // Change UI theme to dark (if needed)
  initialiseTheme(prefersDarkTheme: boolean) {
    if (prefersDarkTheme === true) {
      this.body.classList.remove("light");
      this.body.classList.add("dark");
    }
  }

  toggleTheme() {
    this.toggleDisplayedTheme();
    this.toggleUserThemePreference();
  }

  toggleDisplayedTheme() {
    this.body.classList.toggle("dark");
    this.body.classList.toggle("light");
  }

  toggleUserThemePreference() {
    this.userService.toggleThemePreference();
  }

  // Return UI theme to light (if needed)
  removeTheme(prefersDarkTheme: boolean) {
    if (prefersDarkTheme === true) {
      this.body.classList.add("light");
      this.body.classList.remove("dark");
    }
  }
}
