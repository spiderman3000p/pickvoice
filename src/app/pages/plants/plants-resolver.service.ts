import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Plant } from '@pickvoice/pickvoice-api/model/plant';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantsResolverService implements Resolve<Plant> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plant> {
    const id = Number(route.paramMap.get('id'));
    const observables = {
      plant: of({}),
      countries: of([]),
      cities: of([])
    };
    return Observable.create((observer) => {
      observables.plant = this.dataProviderService.getPlant(id);
      observables.countries = this.dataProviderService.getAllCountries();
      observables.cities = of([])
      observer.next(observables);
      observer.complete();
    });
  }
}
