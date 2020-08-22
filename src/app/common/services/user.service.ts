import { Injectable } from '@angular/core';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  constructor() { }

  /**
   * Return current user
   */
  getUser(): User {
    return this.user;
  }

  /**
   * Set current user after successful login
   * @param user user that has just logged in
   */
  setUser(user: User) {
    this.user = user;
  }

  /**
   * Fetch user from DB to validate login information
   * 
   * // TODO: fetch user from DB
   * @param username username of the user that is trying to log in
   */
  getUserFromDB(username: string): User {
    const matija: User = {
      id: 1,
      name: "matija",
      password: "1234asdf",
      darkTheme: true,
      showWarning: false
    }

    const testuser: User = {
      id: 2,
      name: "testuser",
      password: "\\zxc\\zxc",
      darkTheme: false,
      showWarning: false
    }
    
    if (username === "matija") {
      return matija;
    } else if (username === "testuser") {
      return testuser;
    } else {
      return null;
    }
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
