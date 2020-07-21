import { Injectable } from '@angular/core';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // TODO: get user from DB
  user: User = {
    id: 1,
    name: "matija",
    password: "1234",
    darkTheme: true,
    showWarning: false
  }

  constructor() { }

  /**
   * Return current user
   */
  getUser(): User {
    return this.user;
  }

  /**
   * Fetch user from DB to validate login information
   * 
   * // TODO: fetch user from DB
   * @param username username of the user that is trying to log in
   */
  getUserFromDB(username: string): User {
    
    return this.user.name === username ? this.user : null;
  }

  toggleThemePreference() {
    this.user.darkTheme = !this.user.darkTheme;
  }

  updateWarning(warning: boolean) {
    this.user.showWarning = warning;
  }

  updatePassword(pass: string) {
    this.user.password = pass;
    // TODO: update DB
  }

  logout() {
    this.user = null;
  }
}
