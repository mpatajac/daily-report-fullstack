import { Component, OnInit } from '@angular/core';
import { User } from "../../common/models/user";
import { UserService } from "../../common/services/user.service";
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  user: User;
  oldPassword: string;
  firstNewPassword: string;
  secondNewPassword: string;
  passwordStrength: string;

  strongRegExp: RegExp;
  okRegExp: RegExp;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.user = await this.userService.getUser();
    this.passwordStrength = 'weak';

    // source: https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    this.strongRegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    this.okRegExp = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
  }


  updatePassword(): void {
    this.userService.updatePassword(this.firstNewPassword);
    this.router.navigateByUrl("/app/dashboard");
  }


  isWeakPassword(): boolean {
    return !this.isOkPassword();
  }

  /**
   * Password is ok if it has at least 8 characters and:
   * 1. 1 lowercase letter and 1 uppercase letter
   * 2. 1 lowercase letter and 1 number
   * 3. 1 uppercase letter and 1 number
   */
  isOkPassword(): boolean {
    return this.okRegExp.test(this.firstNewPassword);
  }

  /**
   * Password is strong if it has at least 8 characters, 1 lowercase letter,
   * 1 uppercase letter and 1 number
   */
  isStrongPassword(): boolean {
    return this.strongRegExp.test(this.firstNewPassword);
  }

  determinePasswordStrength(): string {
    const strengthMeter = document.getElementById('pass-strength');
    const passInputField = document.getElementsByName('firstNewPassword')[0];

    if (this.isStrongPassword()) {
      this.passwordStrength = 'strong';
    } else if (this.isOkPassword()) {
      this.passwordStrength = 'ok';
    } else {
      this.passwordStrength = 'weak';
    }

    strengthMeter.classList.remove('strong', 'ok', 'weak');
    strengthMeter.classList.add(this.passwordStrength);

    // only change border color if field was written in
    if (passInputField.classList.contains('ng-dirty')) {
      passInputField.classList.remove('strong', 'ok', 'weak');

      if (this.firstNewPassword === this.user?.password) {
        passInputField.classList.add('weak');
      } else {
        passInputField.classList.add(this.passwordStrength);
      }
    }

    return this.passwordStrength;
  }

  /**
   * Test if the form is valid and all password requirements are fulfilled
   * @param form password input form
   */
  canSubmit(form: NgForm): boolean {
    return form.valid &&
      this.user?.password === this.oldPassword &&
      this.firstNewPassword &&
      this.isOkPassword() &&
      this.user?.password !== this.firstNewPassword &&
      this.firstNewPassword === this.secondNewPassword;
  }
}
