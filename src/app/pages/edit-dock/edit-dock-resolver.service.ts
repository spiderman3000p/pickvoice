import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditDockResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      row: of({}),
      dockTypes: of([]),
      sections: of([]),
      locationTypes: of([]),
      locationStates: of([])
    };
    return Observable.create((observer) => {
      observables.row = this.dataProviderService.getDock(Number(route.paramMap.get('id')));
      observables.dockTypes = this.dataProviderService.getAllDockTypes();
      observables.sections = this.dataProviderService.getAllSections();
      observables.locationTypes = this.dataProviderService.getAllLocationTypes();
      observables.locationStates = this.dataProviderService.getAllLocationStates();
      observer.next(observables);
      observer.complete();
    });
  }
}
