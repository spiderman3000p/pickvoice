import { Injectable } from '@angular/core';
import { RecentOrigin } from '../models/recent-origin.model';
import { Observable, from, of, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';

interface RecentOriginsFilters {
    fromDate: Date;
    toDate: Date;
    filename: string;
    filepath: string;
    user: string;
    totalRows: number;
    invalidRows: number;
}
@Injectable({
    providedIn: 'root'
})
export class RecentOriginsService {
    itemsRecentOrigins: RecentOrigin[];
    locationsRecentOrigins: RecentOrigin[];
    ordersRecentOrigins: RecentOrigin[];
    itemsFilters: RecentOriginsFilters;
    locationsFilters: RecentOriginsFilters;
    ordersFilters: RecentOriginsFilters;

    constructor(private utilities: UtilitiesService) {
        if (typeof(Storage) === 'undefined') {
            throw new Error('The Local Storage is not available in this browser');
        }
        this.itemsRecentOrigins = [];
        this.locationsRecentOrigins = [];
        this.ordersRecentOrigins = [];
    }

    getRecentOrigins(type: string, filters?: RecentOriginsFilters): Observable<RecentOrigin[]> {
        // TODO: obtener origenes recientes desde bd local
        // localStorage.clear();
        return new Observable(suscriber => {
            // this.utilities.log('localStorage', localStorage);
            let origin: RecentOrigin;
            for (const storage in localStorage) {
                if (1) {
                    // this.utilities.log('storage', storage);
                    if (storage.includes(`${type}_origin_`)) {
                        if (this[`${type}RecentOrigins`].findIndex(_origin => _origin.id === storage) === -1) {
                            this.utilities.log('origin found', storage);
                            origin = JSON.parse(localStorage.getItem(storage)) as RecentOrigin;
                            this.utilities.log('origin object', origin);
                            if (origin.id) {
                                this[`${type}RecentOrigins`].push(origin);
                            }
                        }
                    }
                }
            }
            suscriber.next(this[`${type}RecentOrigins`]);
        });
    }

    addRecentOrigin(type: string, origin: RecentOrigin): Observable<any> {
        // TODO: guardar un origen en la bd local
        localStorage.setItem(`${type}_origin_${origin.date.getTime()}`, JSON.stringify(origin));
        const response = Observable.create(true);
        return response;
    }

    clearStorage(type: string): Observable<boolean> {
        return new Observable(suscriber => {
            // eliminar origines en local storage
            for (const storage in localStorage) {
                if (1) {
                    this.utilities.log('storage', storage);
                    if (storage.includes(`${type}_origin_`)) {
                        localStorage.removeItem(storage);
                    }
                }
            }
            this[`${type}RecentOrigins`] = [];
            suscriber.next(true);
        });
    }
}
