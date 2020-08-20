import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize, take, filter, switchMap, tap } from 'rxjs/operators';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor(private authService: AuthService, private router: Router) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // console.log('url', req.url);
        if (req.url.includes(environment.apiBaseUrl)) {
            if (this.authService.getSessionToken() !== null) {
                req = this.setTokenToRequest(req, this.authService.getSessionToken());
            }
            return next.handle(req).pipe(catchError(error => {
                console.error('Error al hacer peticion api', error);
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(req, next);
                } else {
                    return throwError(error);
                }
            }));
        } else if (req.url.includes(environment.apiKeycloak)) {
            return next.handle(req).pipe(catchError(error => {
                console.error('Error al hacer peticion token', error);
                if (error instanceof HttpErrorResponse && error.status === 400) {
                    return this.handle400Error(req, next);
                } else {
                    return throwError(error);
                }
            }));
        } else {
            return next.handle(req);
        }
    }

    handle400Error(req: HttpRequest<any>, next: HttpHandler) {
        this.isRefreshingToken = false;
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(true);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        console.log('Handling error 401...');
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
            return this.authService.refreshToken().pipe(switchMap((response: any) => {
                console.log('Respuesta al refrescar token en pipe: ', response);
                if (response && response.access_token) {
                    this.tokenSubject.next(response.access_token);
                    return next.handle(this.setTokenToRequest(req, response.access_token));
                }
                if (req.url.includes(environment.apiKeycloak)) {
                    return next.handle(req).pipe(catchError(error => {
                        console.error('Error al hacer peticion token', error);
                        if (error instanceof HttpErrorResponse && error.status === 401) {
                            return this.handle401Error(req, next);
                        } else if (error instanceof HttpErrorResponse && error.status === 400) {
                            return this.handle400Error(req, next);
                        }
                    }));
                }
                // If we don't get a new token, we are in trouble so logout.
                console.error('Error desconocido...haciendo logout');
                this.authService.logout();
                this.router.navigate(['/login']);
                return of(true);
            }), catchError(error => {
                // If we don't get a new token, we are in trouble so logout.
                console.error('Error desconocido...haciendo logout', error);
                this.authService.logout();
                this.router.navigate(['/login']);
                return of(true);
            }), finalize(() => {
                this.isRefreshingToken = false;
            }));
        } else {
            console.log('ya se esta refrescando el token');
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
                    return next.handle(this.setTokenToRequest(req, token));
                }));
        }
    }

    setTokenToRequest(req, token) {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const ownerId = this.authService.getOwnerId();
        if (ownerId !== null) {
            headers['owner-id'] = ownerId;
        }
        const plantId = this.authService.getPlantId();
        if (plantId !== null) {
            headers['plant-id'] = plantId;
        }
        const depotId = this.authService.getDepotId();
        if (depotId !== null) {
            headers['depot-id'] = depotId;
        }
        const cityId = this.authService.getCityId();
        if (cityId !== null) {
            headers['city-id'] = cityId;
        }
        return req.clone({
            setHeaders: headers
        });
  }
}
