import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { UserService } from 'src/app/common/services/user.service';
import { ThemeService } from 'src/app/common/services/theme.service';
import { Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  user: User;

  // used for form validation
  usernameFound: boolean;
  passwordMatches: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    // initially set to "true", so the error message doesn't show up
    this.usernameFound = true;
    this.passwordMatches = true;
  }

  /**
   * 1. Search for user with given username
   * 2. If such user exists, attempt login
   * 3. If login is successful, init user and dashboard
   */
  async login() {
    this.usernameFound = await this.userService.doesUserExist(this.username);
    if (!this.usernameFound) return;
    
    this.passwordMatches = await this.userService.login(this.username, this.password);

    if (this.passwordMatches) {
      // successful login
      this.user = await this.userService.getUser();
      this.themeService.initialiseTheme(this.user.darkTheme);
      this.router.navigateByUrl("/app/dashboard");
    }
  }

  /** 
   * Decide should username input box have red border.
   * 
   * @note Using ngForm instead of ngModel in order to mark
   * the box if someone starts typing in the password 
   * before the username.
   */
  checkUsernameValid(form: NgForm): boolean {
    return form.dirty && (
      this.username === undefined ||
      this.username.length < 3
    );
  }

  /** Decide should password input box have red border */
  checkPasswordValid(
    input: NgModel,
    minimumPasswordLength: Number
  ): boolean {
    return input.dirty && (
      this.password === undefined ||
      this.password.length < minimumPasswordLength
    );
  }

}
