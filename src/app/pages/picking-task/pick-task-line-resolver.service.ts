import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PickTaskLine } from '@pickvoice/pickvoice-api/model/picktaskline';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PickTaskLineResolverService implements Resolve<PickTaskLine> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PickTaskLine> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      // observer.next(this.dataProviderService.getPickTaskLine(id));
      observer.complete();
    });
  }
}
