import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs';

import { User } from '@app/common/models/user';
import { ThemeService } from '@app/common/services/theme.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  private baseUrl = "http://localhost:3000/api";

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
    const header = this.createHeader();
    const body = `username=${username}&password=${password}&grant_type=password`;

    return this.http.post<{
      access_token: string,
      error: string
    }>(
      `${this.baseUrl}/login`,
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
          this.themeService.initialiseTheme(this.user.darkTheme);
          if (!this.hasThemeField()) {
            await this.addThemeField();
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

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: this.user.darkTheme,
      },
      { headers: header }
    ).subscribe();
  }

  async updatePassword(password: string) {
    const header = this.createHeader();
    const body = {
      newPassword: password
    };

    this.http.put(
      `${this.baseUrl}/users/${this.user.name}/password`,
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

  /**
   * User is logged in if:
   * 1. local user is defined or
   * 2. username is stored and token is vaild (i.e. GET request has status 2xx)
   */
  async isLoggedIn(): Promise<boolean> {
    if (this.user !== undefined) {
      return true;
    }

    if (localStorage.username) {
      try {
        await this.fetchUserFromDB();
        return true;
      } catch (e) {
        this.clearUserData();
        return false;
      }
    }

    return false;
  }

  private async hasThemeField(): Promise<boolean> {
    let response = await this.fetchUserFromDB();
    return response.darkTheme !== undefined;
  }

  /**
   * When user logs in for the first time,
   * add "darkTheme" field.
   */
  private async addThemeField() {
    const header = this.createHeader();

    return this.http.put(
      `${this.baseUrl}/users/${this.user.name}`,
      {
        darkTheme: false,
      },
      { headers: header }
    ).subscribe();
  }

  async updateLocalUser() {
    let response = await this.fetchUserFromDB();

    this.user = this.user ?? new User(response.name);
    this.user.darkTheme = response.darkTheme;
  }

  /**
   * Create HttpHeader containing user auth token
   */
  createHeader(): HttpHeaders {
    return new HttpHeaders({
			"Authorization": `Bearer ${localStorage.token}`
		});
  }
}
