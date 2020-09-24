import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs';

import { User } from "../models/user";
import { ThemeService } from "../services/theme.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  private baseUrl = "https://api.baasic.com/v1/daily-report-app";

  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) { }

  /**
   * Update local user
   * (if undefined)
   * and return them.
   */
  async getUser(): Promise<User> {
    if (this.user === undefined) {
      await this.updateLocalUser();

      // update displayed theme when re-setting the user
      this.themeService.initialiseTheme(this.user.darkTheme);
    }

    return this.user;
  }

  private async fetchUserFromDB(): Promise<any> {
    const header = this.createHeader();
    return this.http.get(
      `${this.baseUrl}/users/${this.user?.name ?? localStorage.username}`,
      { headers: header }
    ).toPromise();
  }

  async login(username: string, password: string) {
    const header = this.createHeader(false, true);
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
    ).pipe(
      tap(
        async response => {
          localStorage.token = response.body.access_token;
          localStorage.username = username;

          await this.updateLocalUser();
          if (await this.isMissingFields()) {
            await this.addMissingFields();
          }
        }),
      map(response => response.ok),
      catchError(_ => of(false))
    ).toPromise();
  }

  async doesUserExist(username: string): Promise<boolean> {
    return this.http.get(`${this.baseUrl}/users/${username}/exists`,
      { observe: 'response' }
    ).pipe(
      map(response => response.ok),
      catchError(_ => of(false))
    ).toPromise()
  }

  async toggleThemePreference() {
    this.user.darkTheme = !this.user.darkTheme;

    const header = this.createHeader();
    const email = await this.extractEmail();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: this.user.darkTheme,
        email: email
      },
      { headers: header }
    ).subscribe();
  }

  async updateWarning(warning: boolean) {
    this.user.showWarning = warning;

    const header = this.createHeader();
    const email = await this.extractEmail();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        showWarning: this.user.showWarning,
        email: email
      },
      { headers: header }
    ).subscribe();
  }

  async updatePassword(password: string) {
    const header = this.createHeader();
    const body = {
      newPassword: password,
      sendMailNotification: false
    };

    this.http.put(
      `${this.baseUrl}/users/${this.user.name}/change-password`,
      body,
      {
        headers: header
      }
    ).subscribe();
  }

  async logout() {
    const header = this.createHeader();
    const options = {
      headers: header,
      body: {
        token: localStorage.token,
        type: "Bearer"
      }
    };

    this.http.delete(`${this.baseUrl}/login`, options).subscribe();
    this.clearUserData();
  }

  /**
   * Reset local user and remove data from localStorage
   * 
   * Used during logout and
   * while handling errors caused by token expiration (401)
   */
  clearUserData() {
    this.user = undefined;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return localStorage.username;
  }

  private async isMissingFields(): Promise<boolean> {
    let response = await this.fetchUserFromDB();
    return response.darkTheme === undefined ||
      response.showWarning === undefined;
  }

  /**
   * When user logs in for the first time,
   * add "darkTheme" and "showWarning" fields.
   */
  private async addMissingFields() {
    const header = this.createHeader();
    const email = await this.extractEmail();

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
  private async extractEmail(): Promise<string> {
    let response = await this.fetchUserFromDB();
    return response.email;
  }


  async updateLocalUser() {
    let response = await this.fetchUserFromDB();

    // TODO: remove password
    this.user = this.user ?? new User(response.name);

    this.user.darkTheme = response.darkTheme;
    this.user.showWarning = response.showWarning;
  }

  /**
   * Create HttpHeader based on given parameters
   * @param token Should header contain auth token
   * @param urlencoded Should header be x-www-form-urlencoded
   */
  createHeader(
    token: boolean = true,
    urlencoded: boolean = false
  ): HttpHeaders {
    let obj = {};
    if (token) {
      obj["Authorization"] = `Bearer ${localStorage.token}`;
    }

    if (urlencoded) {
      obj["Content-Type"] = "application/x-www-form-urlencoded";
    }

    return new HttpHeaders(obj);
  }
}
