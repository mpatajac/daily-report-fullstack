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
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<true | UrlTree> {
    if (await this.userService.isLoggedIn()) {
      return true;
    }

    return this.router.parseUrl("/login");
  }

}
