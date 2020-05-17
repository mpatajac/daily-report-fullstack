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

  getUser(): User {
    return this.user;
  }

  getUserFromDB(username: string): User {
    // TODO: fetch user from DB
    return this.user.name === username ? this.user : null;
  }

  toggleTheme() {
    this.user.darkTheme = !this.user.darkTheme;
  }

  updateWarning(warning: boolean) {
    this.user.showWarning = warning;
  }

  updatePassword(pass: string) {
    this.user.password = pass;
    // TODO: update DB
  }
}
