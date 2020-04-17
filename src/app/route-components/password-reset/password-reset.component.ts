import { Component, OnInit } from '@angular/core';
import { User } from "../../common/models/user";
import { UserService } from "../../common/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  user: User;
  oldPass: string;
  firstNewPass: string;
  secondNewPass: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }


  updatePassword(): void {
    // TODO: add better password strength checking
    if 
    (
      this.user.password === this.oldPass &&
      this.firstNewPass && 
      this.firstNewPass === this.secondNewPass
    ) {
      this.userService.updatePassword(this.firstNewPass);
      this.router.navigateByUrl("/app/dashboard");
    }
  }
}
