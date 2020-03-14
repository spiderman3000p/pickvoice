import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ItemType } from '@pickvoice/pickvoice-api/model/itemtype';
import { ItemTypeService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemTypesResolverService implements Resolve<ItemType> {

  constructor(private itemsTypeService: ItemTypeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemType> {
    const id = route.paramMap.get('id');
    return this.itemsTypeService.retrieveItemType(id);
  }
}
