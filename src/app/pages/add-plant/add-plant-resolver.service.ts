import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddPlantResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      countries: of([]),
      cities: of([]),
      departments: of([])
    };
    return Observable.create((observer) => {
      observables.countries = this.dataProviderService.getAllCountries();
      observer.next(observables);
      observer.complete();
    });
  }
}
