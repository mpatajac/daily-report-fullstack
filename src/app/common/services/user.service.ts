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
    this.fetchUserFromDB().subscribe(
      response => this.updateLocalUser(response)
    );
    return this.user;
  }

  private fetchUserFromDB(): Observable<any> {
    const header = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get(
      `${this.baseUrl}/users/${this.user.name}`,
      { headers: header }
    );
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
        if (this.isMissingFields()) {
          this.addMissingFields();
        }
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
    this.user.darkTheme = !this.user.darkTheme;

    const header = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    const email: string = this.extractEmail();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: this.user.darkTheme,
        email: email
      },
      { headers: header }
    ).subscribe();
  }

  updateWarning(warning: boolean) {
    this.user.showWarning = warning;

    const header = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    const email: string = this.extractEmail();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: this.user.showWarning,
        email: email
      },
      { headers: header }
    ).subscribe();
  }

  updatePassword(pass: string) {
    // TODO: update DB
    this.user.password = pass;
  }

  logout() {
    // TODO: DELETE on API
    this.user = null;
  }

  private isMissingFields(): boolean {
    let result: boolean;
    this.fetchUserFromDB().subscribe(
      response => {
        result = response["darkTheme"] !== undefined ||
          response["showWarning"] !== undefined;
      }
    )
    return result;
  }

  /**
   * When user logs in for the first time,
   * add "darkTheme" and "showWarning" fields.
   */
  private addMissingFields() {
    const header = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    const email: string = this.extractEmail();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: false,
        showWarning: true,
        email: email
      },
      { headers: header }
    ).subscribe();
  }

  /**
   * Extracts "email" field from user data.
   * 
   * For some reason, PUT request on other fields sets "email" to null.
   * This method is used to extract it and update it along with the request.
   */
  private extractEmail(): string {
    let email: string;
    this.fetchUserFromDB().subscribe(response => email = response.email);
    return email;
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
