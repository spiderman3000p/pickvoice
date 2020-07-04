import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddItemResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      itemTypes: of([]),
      uoms: of([]),
      states: of([]),
      classifications: of([]),
      qualityStates: of([])
    };
    return Observable.create((observer) => {
      observables.itemTypes = this.dataProviderService.getAllItemTypes();
      observables.uoms = this.dataProviderService.getAllUoms();
      observables.states = this.dataProviderService.getAllItemStates();
      observables.classifications = this.dataProviderService.getAllItemClassifications();
      observables.qualityStates = this.dataProviderService.getAllQualityStates();
      observer.next(observables);
      observer.complete();
    });
  }
}
