import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddLocationResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      locationTypes: of([]),
      sections: of([]),
      operations: of([]),
      states: of([])
    };
    return Observable.create((observer) => {
      observables.locationTypes = this.dataProviderService.getAllLocationTypes();
      observables.sections = this.dataProviderService.getAllSections();
      observables.states = this.dataProviderService.getAllLocationStates();
      observables.operations = this.dataProviderService.getAllLocationOperations();
      observer.next(observables);
      observer.complete();
    });
  }
}
