import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitializeResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router,
              private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const username = this.authService.getUsername();
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getMemberData(username));
      observer.complete();
    });
  }
}
