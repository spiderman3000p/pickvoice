import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Transport } from '@pickvoice/pickvoice-api/model/transport';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransportResolverService implements Resolve<Transport> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transport> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getTransport(id));
      observer.complete();
    });
  }
}
