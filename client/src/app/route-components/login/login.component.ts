import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import gsap from "gsap";
import { UserService } from '@app/common/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  // used for form validation
  usernameFound: boolean;
  passwordMatches: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  async ngOnInit() {
    // if the user is already logged in, redirect them to dashboard
    if (await this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/app/dashboard");
      return;
    }

    // initially set to "true", so the error message doesn't show up
    this.usernameFound = true;
    this.passwordMatches = true;

		// initialize animation
		this.initAnimation();
  }

  /**
   * 1. Search for user with given username
   * 2. If such user exists, attempt login
   * 3. If login is successful, go to dashboard
   */
  async login() {
    this.usernameFound = await this.userService.doesUserExist(this.username);
    if (!this.usernameFound) return;
    
    this.passwordMatches = await this.userService.login(this.username, this.password);

    if (this.passwordMatches) {
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

	
	initAnimation(): void {
		const delay = 5;
		const stepDuration = 1;
		const toCenter = -200, toLeft = -400;
		let timeline = gsap.timeline({
			repeat: -1,
			delay: delay,
			repeatDelay: delay,
			yoyo: false,
			defaults: {
				duration: stepDuration,
				ease: "power3.inOut"
			}
		});

		timeline.to("#done1", { xPercent: toLeft }, 0 * delay)
			.to("#inProgress", { xPercent: toCenter }, 0 * delay)

			.to("#inProgress", { xPercent: toLeft }, 1 * delay)
			.to("#scheduled", { xPercent: toCenter }, 1 * delay)

			.to("#scheduled", { xPercent: toLeft }, 2 * delay)
			.to("#problems", { xPercent: toCenter }, 2 * delay)

			.to("#problems", { xPercent: toLeft }, 3 * delay)
			.to("#done2", { xPercent: toCenter }, 3 * delay)

	}
}
