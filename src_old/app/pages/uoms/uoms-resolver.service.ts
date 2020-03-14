import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UnityOfMeasure } from '@pickvoice/pickvoice-api/model/unityOfMeasure';
import { UomService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UomsResolverService implements Resolve<UnityOfMeasure> {

  constructor(private itemsTypeService: UomService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UnityOfMeasure> {
    const id = route.paramMap.get('id');
    return this.itemsTypeService.retrieveUom(id);
  }
}
