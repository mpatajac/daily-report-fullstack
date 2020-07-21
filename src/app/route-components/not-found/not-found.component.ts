import { Component, OnInit } from '@angular/core';
import { User } from '../../common/models/user';
import { UserService } from 'src/app/common/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  /**
   * Choose redirect destination based on user
   * being or not being logged in
   */
  redirect() {
    if (this.user) {
      this.router.navigateByUrl("/app/dashboard");
    } else {
      this.router.navigateByUrl("/login");
    } 
  }

}
