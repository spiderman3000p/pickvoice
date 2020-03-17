import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Section } from '@pickvoice/pickvoice-api/model/section';
import { SectionService } from '@pickvoice/pickvoice-api';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionsResolverService implements Resolve<Section> {

  constructor(private sectionsService: SectionService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Section> {
    const id = Number(route.paramMap.get('id'));
    return this.sectionsService.retrieveSectionById(id);
  }
}
