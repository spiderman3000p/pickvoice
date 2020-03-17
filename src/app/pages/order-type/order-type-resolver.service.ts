import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { OrderType } from '@pickvoice/pickvoice-api/model/orderType';
import { OrderTypeService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderTypeResolverService implements Resolve<OrderType> {

  constructor(private orderTypeService: OrderTypeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderType> {
    const id = Number(route.paramMap.get('id'));
    return this.orderTypeService.retrieveorderTypeById(id);
  }
}
