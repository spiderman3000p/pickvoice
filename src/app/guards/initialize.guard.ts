import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot,
         Route, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    // TODO: check login status
    return this.checkMemberData(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    return this.checkMemberData(route.path);
  }

  checkMemberData(url: string) {
    const memberData = this.authService.getUserMemberData();
    console.log('url: ', url);
    console.log('memberData: ', memberData);
    if (memberData && memberData.depotId && memberData.plantId && memberData.ownerId) {
      if (!url.includes('initialize')) {
        return true;
      } else {
        this.router.navigate(['/pages/dashboard']);
        return false;
      }
    } else {
      if (url.includes('initialize')) {
        return true;
      } else {
        this.router.navigate(['/initialize']);
        return false;
      }
    }
  }
}
