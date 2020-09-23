import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs';

import { User } from "../models/user";

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
   * Update local user
   * and return them.
   */
  async getUser(): Promise<User> {
    return this.user;
  }

  private async fetchUserFromDB(): Promise<any> {
    const header = this.createHeader();
    return this.http.get(
      `${this.baseUrl}/users/${this.user.name}`,
      { headers: header }
    ).toPromise();
  }

  /**
   * Set current user after successful login
   * 
   * TODO: remove password
   */
  async setUser(username: string, password: string) {
    this.user = new User(username, password);
    await this.updateLocalUser();
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
          this.token = response.body.access_token;
          await this.setUser(username, password);
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

  async updatePassword(pass: string) {
    // TODO: update DB
    this.user.password = pass;
  }

  async logout() {
    // TODO: DELETE on API
    this.user = null;
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
    this.user.name = response.name;
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
      obj["Authorization"] = `Bearer ${this.token}`;
    }

    if (urlencoded) {
      obj["Content-Type"] = "application/x-www-form-urlencoded";
    }

    return new HttpHeaders(obj);
  }
}
