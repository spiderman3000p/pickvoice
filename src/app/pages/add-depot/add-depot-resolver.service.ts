import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddDepotResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      states: of([])
    };
    return Observable.create((observer) => {
      observables.states = this.dataProviderService.getAllLpnStates();
      observer.next(observables);
      observer.complete();
    });
  }
}
