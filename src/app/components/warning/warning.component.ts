import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  onChange(e) {
    this.showWarning = !e.target.checked;    
  }

  submitChange() {
    this.user.showWarning = this.showWarning;
  }

}
