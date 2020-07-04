import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddTransportResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      uoms: of([]),
      states: of([])
    };
    return Observable.create((observer) => {
      observables.uoms = this.dataProviderService.getAllUoms();
      observables.states = this.dataProviderService.getAllItemStates();
      observer.next(observables);
      observer.complete();
    });
  }
}
