import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Section } from '@pickvoice/pickvoice-api/model/section';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionsResolverService implements Resolve<Section> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Section> {
    const id = Number(route.paramMap.get('id'));
    return this.dataProviderService.getSection(id);
  }
}
