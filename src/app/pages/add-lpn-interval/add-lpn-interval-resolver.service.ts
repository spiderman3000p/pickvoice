import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AddLpnIntervalResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const observables = {
      templates: of([])
    };
    return Observable.create((observer) => {
      observables.templates = this.dataProviderService.getAllTemplates()
      .pipe(tap(results => { console.log('template results: ', results); return results; }));
      observer.next(observables);
      observer.complete();
    });
  }
}
