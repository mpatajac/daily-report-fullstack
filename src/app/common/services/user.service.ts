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
   * Fetch user data from server 
   * and update local user.
   */
  getUser(): User {
    this.http
      .get(`${this.baseUrl}/users/${this.user.name}`)
      .subscribe(
        response => this.updateLocalUser(response)
      );
    return this.user;
  }

  /**
   * Set current user after successful login
   * @param user user that has just logged in
   */
  setUser(user: User) {
    this.user = user;
  }


  // TODO: work on error-handling
  login(username: string, password?: string) {
    const header = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" });

    const body = `username=${username}&password=${password}&grant_type=password`;

    return this.http.post<{
      access_token: string,
      error: string
    }>(
      `${this.baseUrl}/login?options=sliding`,
      body,
      {
        headers: header,
        observe: 'response'
      }
    ).subscribe(
      response => {
        this.token = response.body.access_token;
        console.log(this.token);
      },
      catchError
    );
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

  private updateLocalUser(response: any) {
    this.user.name = response.name;
    this.user.darkTheme = response.darkTheme;
    this.user.showWarning = response.showWarning;
  }

  private handleError(result?: any) {
    return (error: any): Observable<any> => {
      return of(result)
    }
  }
}
