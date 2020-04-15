import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Dock } from '@pickvoice/pickvoice-api/model/dock';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocksResolverService implements Resolve<Dock> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Dock> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getDock(id));
      observer.complete();
    });
  }
}
