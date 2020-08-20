import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickingTaskComponent } from './picking-task.component';
import { EditPickTaskComponent } from '../edit-pick-task/edit-pick-task.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { PickTaskResolverService } from './pick-task-resolver.service';
import { PickTaskLineResolverService } from './pick-task-line-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'view/:id',
        // component: EditRowComponent,
        component: EditPickTaskComponent,
        resolve: {
            row: PickTaskResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.PICK_TASKS
        }
    },
    {
        path: 'edit/:id',
        // component: EditRowComponent,
        component: EditPickTaskComponent,
        resolve: {
            row: PickTaskResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.PICK_TASKS
        }
    },
    {
        path: IMPORTING_TYPES.PICK_TASKLINES + '/view' + '/:id',
        // component: EditRowComponent,
        component: EditRowComponent,
        resolve: {
            row: PickTaskLineResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.PICK_TASKLINES
        }
    },
    {
        path: IMPORTING_TYPES.PICK_TASKLINES + '/edit' + '/:id',
        // component: EditRowComponent,
        component: EditRowComponent,
        resolve: {
            row: PickTaskLineResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.PICK_TASKLINES
        }
    },
    {
        path: '',
        component: PickingTaskComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PickingTaskRoutingModule {}
