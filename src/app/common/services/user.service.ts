import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";

import { User } from "../models/user";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  token: string;

  private baseUrl = "https://api.baasic.com/v1/daily-report-app";

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Return current user
   * TODO: GET user from API
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

  doesUserExist(username: string): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/users/${username}/exists`,
      { observe: 'response' }
    ).pipe(
      map(response => response.ok),
      catchError(this.handleError)
    )
  }

  toggleThemePreference() {
    // TODO: PUT on API
    // pass email along with data (so it doesn't set to null)
    this.user.darkTheme = !this.user.darkTheme;
  }

  updateWarning(warning: boolean) {
    // TODO: PUT on API
    // pass email along with data (so it doesn't set to null)
    this.user.showWarning = warning;
  }

  updatePassword(pass: string) {
    // TODO: update DB
    this.user.password = pass;
  }

  logout() {
    // TODO: DELETE on API
    this.user = null;
  }

  private handleError(result?: any) {
    return (error: any): Observable<any> => {
      return of(result)
    }
  }
}
