import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AddOrderResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      orderTypes: of([]),
      transports: of([]),
      customers: of([])
    };
    return Observable.create((observer) => {
      observables.orderTypes = this.dataProviderService.getAllOrderTypes();
      observables.transports = this.dataProviderService.getAllTransports().pipe(map(result => result.content));
      observables.customers = this.dataProviderService.getAllCustomers().pipe(map(result => result.content));
      observer.next(observables);
      observer.complete();
    });
  }
}
