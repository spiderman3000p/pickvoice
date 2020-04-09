import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PickTask } from '@pickvoice/pickvoice-api/model/picktask';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PickTaskResolverService implements Resolve<PickTask> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PickTask> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getPickTask(id));
      observer.complete();
    });
  }
}
