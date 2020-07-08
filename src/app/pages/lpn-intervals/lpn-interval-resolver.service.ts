import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { LpnInterval } from '@pickvoice/pickvoice-api/model/lpninterval';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LpnIntervalResolverService implements Resolve<LpnInterval> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LpnInterval> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getLpnInterval(id));
      observer.complete();
    });
  }
}
