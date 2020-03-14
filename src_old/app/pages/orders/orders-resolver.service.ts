import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Order } from '@pickvoice/pickvoice-api/model/order';
import { OrderService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersResolverService implements Resolve<Order> {

  constructor(private ordersService: OrderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    const id = Number(route.paramMap.get('id'));
    return this.ordersService.retrieveOrder(id);
  }
}
