import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemResolverService implements Resolve<any> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getInventoryItem(id));
      observer.complete();
    });
  }
}
