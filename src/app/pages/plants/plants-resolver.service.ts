import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Plant } from '@pickvoice/pickvoice-api/model/plant';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantsResolverService implements Resolve<Plant> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plant> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getPlant(id));
      observer.complete();
    });
  }
}
