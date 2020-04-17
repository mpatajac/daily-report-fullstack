import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "../../common/models/user";
import { UserService } from "../../common/services/user.service";

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
  labels: string[] = [
    "done",
    "in progress",
    "scheduled",
    "problems"
  ];

  user: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  submitReport() {
    // TODO: check if any input field is empty, get data
    if (this.user.showWarning === false) {
      this.router.navigateByUrl("/app/dashboard")
    }
  }

}
