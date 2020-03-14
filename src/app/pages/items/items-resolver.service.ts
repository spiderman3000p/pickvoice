import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Item } from '@pickvoice/pickvoice-api/model/item';
import { ItemsService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsResolverService implements Resolve<Item> {

  constructor(private itemsService: ItemsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item> {
    const id = Number(route.paramMap.get('id'));
    return this.itemsService.retrieveItem(id);
  }
}
