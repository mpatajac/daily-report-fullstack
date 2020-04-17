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
}
