import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  /**
   * Check that the user is logged in, 
   * otherwise redirect to login view.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    if (this.userService.isLoggedIn()) {
      return true;
    }

    this.userService.clearUserData();
    return this.router.parseUrl("/login");
  }

}
