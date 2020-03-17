import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Customer } from '@pickvoice/pickvoice-api/model/customer';
import { CustomerService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerResolverService implements Resolve<Customer> {

  constructor(private customerService: CustomerService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> {
    const id = Number(route.paramMap.get('id'));
    return this.customerService.retrieveCustomerById(id);
  }
}
