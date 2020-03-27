import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Location } from '@pickvoice/pickvoice-api/model/location';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationsResolverService implements Resolve<Location> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Location> {
    const id = Number(route.paramMap.get('id'));
    return this.dataProviderService.getLocation(id);
  }
}
