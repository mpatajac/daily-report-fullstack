import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "../../common/models/user";
import { UserService } from "../../common/services/user.service";

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
  user: User;
  showWarning: boolean;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  onChange(e) {
    this.showWarning = !e.target.checked;
    console.log(this.showWarning);
     
  }

  submitChange() {
    if (this.showWarning !== undefined && this.user.showWarning !== this.showWarning) {
      this.userService.updateWarning(this.showWarning);
    }

    // TODO: collect data from input

    this.router.navigateByUrl("/app/dashboard");
  }

}
