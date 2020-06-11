import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    // TODO: check login status
    return this.checkLogin(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.getRemember() && this.authService.getUsername() &&
        this.authService.getRememberUsername() === this.authService.getUsername()) {
      return true;
    }
    if (this.authService.isLoggedIn()) {
      if (url && url.includes('/login')) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (url && url.includes('/login')) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
