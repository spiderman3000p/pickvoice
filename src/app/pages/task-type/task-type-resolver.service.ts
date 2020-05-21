import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { TaskType } from '@pickvoice/pickvoice-api/model/taskType';
import { DataProviderService} from '../../services/data-provider.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskTypeResolverService implements Resolve<TaskType> {

  constructor(private dataProviderService: DataProviderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskType> {
    const id = Number(route.paramMap.get('id'));
    return Observable.create((observer) => {
      observer.next(this.dataProviderService.getTaskType(id));
      observer.complete();
    });
  }
}
