import { Injectable, Injector } from '@angular/core';
import { UserService } from '@app/common/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  body: HTMLElement = document.body;

  constructor(private injector: Injector) { }

  /**
   * Change UI theme to dark (if needed)
   * @param prefersDarkTheme user's preference over light/dark theme
   */
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
    // injected to handle circular dependency (false positive)
    const userService = this.injector.get(UserService);
    userService.toggleThemePreference();
  }

  /**
   * Return UI theme to light (if needed)
   * @param prefersDarkTheme user's preference over light/dark theme
   */
  removeTheme(prefersDarkTheme: boolean) {
    if (prefersDarkTheme === true) {
      this.body.classList.add("light");
      this.body.classList.remove("dark");
    }
  }
}
