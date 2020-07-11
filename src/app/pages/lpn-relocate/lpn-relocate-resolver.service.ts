import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LpnRelocateResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      types: of([]),
      lpns: of([])
    };
    return Observable.create((observer) => {
      observables.types = this.dataProviderService.getAllLocationTypes();
      observables.lpns = this.dataProviderService.getAllLpnVO3('startRow=0;endRow=10');
      observer.next(observables);
      observer.complete();
    });
  }
}
