import { Injectable } from '@angular/core';
import { RecentOrigin } from '../models/recent-origin.model';
import { Observable, from, of, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';

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
    public itemsRecentOrigins = new Subject<RecentOrigin[]>();
    public locationsRecentOrigins = new Subject<RecentOrigin[]>();
    public ordersRecentOrigins = new Subject<RecentOrigin[]>();
    _itemsRecentOrigins: RecentOrigin[];
    _locationsRecentOrigins: RecentOrigin[];
    _ordersRecentOrigins: RecentOrigin[];
    itemsFilters: RecentOriginsFilters;
    locationsFilters: RecentOriginsFilters;
    ordersFilters: RecentOriginsFilters;

    constructor() {
        if (typeof(Storage) === 'undefined') {
            throw new Error('The Local Storage is not available in this browser');
        }
        this._itemsRecentOrigins = [];
        this._locationsRecentOrigins = [];
        this._ordersRecentOrigins = [];
    }

    getRecentOrigins(type: string, filters?: RecentOriginsFilters): Observable<any> {
        // TODO: obtener origenes recientes desde bd local
        // localStorage.clear();
        return new Observable(suscriber => {
            console.log('localStorage', localStorage);
            let origin: RecentOrigin;
            for (const storage in localStorage) {
                if (1) {
                    console.log('storage', storage);
                    if (storage.includes(`${type}_origin_`)) {
                        if (this._itemsRecentOrigins.findIndex(_origin => _origin.id === storage) === -1) {
                            console.log('origin found', storage);
                            origin = JSON.parse(localStorage.getItem(storage)) as RecentOrigin;
                            console.log('origin object', origin);
                            if (origin.id) {
                                if (type === 'items') {
                                    this._itemsRecentOrigins.push(origin);
                                }
                                if (type === 'locations') {
                                    this._locationsRecentOrigins.push(origin);
                                }
                                if (type === 'orders') {
                                    this._ordersRecentOrigins.push(origin);
                                }
                            }
                        }
                    }
                }
            }
            if (type === 'items') {
                this.itemsRecentOrigins.next(this._itemsRecentOrigins);
                suscriber.next(this._itemsRecentOrigins);
            }
            if (type === 'locations') {
                this.locationsRecentOrigins.next(this._locationsRecentOrigins);
                suscriber.next(this._locationsRecentOrigins);
            }
            if (type === 'orders') {
                this.locationsRecentOrigins.next(this._ordersRecentOrigins);
                suscriber.next(this._ordersRecentOrigins);
            }
        });
    }

    addRecentOrigin(type: string, origin: RecentOrigin): Observable<any> {
        // TODO: guardar un origen en la bd local
        localStorage.setItem(`${type}_origin_${origin.date.getTime()}`, JSON.stringify(origin));
        const response = Observable.create(true);
        return response;
    }

    clearStorage(type: string) {
        return new Observable(suscriber => {
            // eliminar origines en local storage
            for (const storage in localStorage) {
                if (1) {
                    console.log('storage', storage);
                    if (storage.includes(`${type}_origin_`)) {
                        localStorage.removeItem(storage);
                    }
                }
            }
            if (type === 'items') {
                this._itemsRecentOrigins = [];
                this.itemsRecentOrigins.next(this._itemsRecentOrigins);
            }
            if (type === 'locations') {
                this._locationsRecentOrigins = [];
                this.locationsRecentOrigins.next(this._locationsRecentOrigins);
            }
            if (type === 'orders') {
                this._ordersRecentOrigins = [];
                this.ordersRecentOrigins.next(this._ordersRecentOrigins);
            }
            suscriber.next(true);
        });
    }
}
