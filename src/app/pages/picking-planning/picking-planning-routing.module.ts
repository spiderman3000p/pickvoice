import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickingPlanningComponent } from './picking-planning.component';
import { EditPickPlanningComponent } from '../edit-pick-planning/edit-pick-planning.component';
import { AddPickPlanningComponent } from '../add-pick-planning/add-pick-planning.component';
import { AddPickPlanningResolverService } from '../add-pick-planning/add-pick-planning-resolver.service';
import { EditPickTaskComponent } from '../edit-pick-task/edit-pick-task.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { PickingPlanningResolverService } from './picking-planning-resolver.service';
import { PickTaskResolverService } from './pick-task-resolver.service';
import { PickTaskLineResolverService } from './pick-task-line-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

const routes: Routes = [
    {
        path: 'edit/:id',
        // component: EditRowComponent,
        component: EditPickPlanningComponent,
        resolve: {
            row: PickingPlanningResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.PICK_PLANNINGS
        },
    },
    {
        path: 'view/:id',
        // component: EditRowComponent,
        component: EditPickPlanningComponent,
        resolve: {
            row: PickingPlanningResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.PICK_PLANNINGS
        }
    },
    {
        path: 'add',
        component: AddPickPlanningComponent,
        resolve: {
            data: AddPickPlanningResolverService,
        }
    },
    {
        path: IMPORTING_TYPES.PICK_TASKS + '/view' + '/:id',
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
        path: IMPORTING_TYPES.PICK_TASKS + '/edit' + '/:id',
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
        component: PickingPlanningComponent
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
export class PickingPlanningRoutingModule {}
