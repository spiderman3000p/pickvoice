import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddOrderLineResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      items: of([]),
      qualityStates: of([])
    };
    return Observable.create((observer) => {
      observables.items = this.dataProviderService.getAllItemTypes();
      observables.qualityStates = this.dataProviderService.getAllQualityStates();
      observer.next(observables);
      observer.complete();
    });
  }
}
