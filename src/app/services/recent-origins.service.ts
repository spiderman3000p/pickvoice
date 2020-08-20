import { Injectable } from '@angular/core';
import { RecentOrigin } from '../models/recent-origin.model';
import { Observable} from 'rxjs';
import { UtilitiesService } from './utilities.service';

@Injectable({
    providedIn: 'root'
})
export class RecentOriginsService {

    constructor(private utilities: UtilitiesService) {
        if (typeof(Storage) === 'undefined') {
            throw new Error('The Local Storage is not available in this browser');
        }
    }

    getRecentOrigins(type: string): Observable<RecentOrigin[]> {
        // TODO: obtener origenes recientes desde bd local
        const origins = [];
        return new Observable(suscriber => {
            // this.utilities.log('localStorage', localStorage);
            let origin: RecentOrigin;
            for (const storage in localStorage) {
                if (1) {
                    // this.utilities.log('storage', storage);
                    if (storage.includes(`${type}_origin_`)) {
                        origin = JSON.parse(localStorage.getItem(storage)) as RecentOrigin;
                        this.utilities.log('origin object', origin);
                        if (origin.id) {
                            origins.push(origin);
                        }
                    }
                }
            }
            suscriber.next(origins);
            suscriber.complete();
        });
    }

    addRecentOrigin(type: string, origin: RecentOrigin): Observable<boolean> {
        /*this.utilities.log(`guardando recent origin en local storage ${type}_origin_${origin.date.getTime()}: `,
        JSON.stringify(origin));*/
        // TODO: guardar un origen en la bd local
        return new Observable(suscriber => {
            localStorage.setItem(`${type}_origin_${origin.date.getTime()}`, JSON.stringify(origin));
            // this.utilities.log(`local storage `, localStorage),
            suscriber.next(true);
            suscriber.complete();
        });
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
            suscriber.next(true);
        });
    }

    clearAll(): Observable<boolean> {
        return new Observable(suscriber => {
            // eliminar origines en local storage
            for (const storage in localStorage) {
                if (1) {
                    this.utilities.log('storage', storage);
                    if (storage.includes(`_origin_`)) {
                        localStorage.removeItem(storage);
                    }
                }
            }
            suscriber.next(true);
        });
    }
}
