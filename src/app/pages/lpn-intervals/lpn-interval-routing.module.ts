import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LpnIntervalComponent } from './lpn-interval.component';
import { EditRowComponent } from '../edit-row/edit-row.component';
import { AddLpnIntervalComponent } from '../add-lpn-interval/add-lpn-interval.component';
import { AddLpnIntervalResolverService } from '../add-lpn-interval/add-lpn-interval-resolver.service';
import { LpnIntervalResolverService } from './lpn-interval-resolver.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { IMPORTING_TYPES } from '../../models/model-maps.model';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
const routes: Routes = [
    {
        path: 'edit/:id',
        component: EditRowComponent,
        resolve: {
            row: LpnIntervalResolverService,
        },
        data: {
            viewMode: 'edit',
            type: IMPORTING_TYPES.LPN_INTERVAL
        }
    },
    {
        path: 'view/:id',
        component: EditRowComponent,
        resolve: {
            row: LpnIntervalResolverService,
        },
        data: {
            viewMode: 'view',
            type: IMPORTING_TYPES.LPN_INTERVAL
        }
    },
    {
        path: 'add',
        component: AddLpnIntervalComponent,
        resolve: {
            data: AddLpnIntervalResolverService,
        }
    },
    {
        path: '',
        component: LpnIntervalComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class LpnIntervalRoutingModule {}
