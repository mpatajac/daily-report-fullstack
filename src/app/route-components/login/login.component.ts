import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/models/user';
import { UserService } from 'src/app/common/services/user.service';
import { ThemeService } from 'src/app/common/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  user: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
  }

  validateUser() {
    this.user = this.userService.getUserFromDB(this.username);
    // user doesn't exist
    if (!this.user) {
      // TODO: warn user
      console.log("User doesn't exist.");
    } else if (this.user.password !== this.password) {
      // TODO: warn user
      console.log("Unsuccessful login attempt.");
    } else {
      // successful login
      this.userService.user = this.user;
      this.themeService.initialiseTheme(this.user.darkTheme);
      this.router.navigateByUrl("/app/dashboard");
    }
  }

}
