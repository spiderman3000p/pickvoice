import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize, take, filter, switchMap, tap } from 'rxjs/operators';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor(private authService: AuthService, private router: Router) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // console.log('url', req.url);
        if (req.url.includes('/api/')) {
            if (this.authService.getSessionToken() !== null) {
                req = this.setTokenToRequest(req, this.authService.getSessionToken());
            }
            return next.handle(req).pipe(catchError(error => {
                console.error('Error al hacer peticion', error);
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(req, next);
                } else {
                    this.router.navigate(['/login']);
                    return throwError(error);
                }
            }));
        } else {
            return next.handle(req);
        }
    }

    handle400Error(error: any) {

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

                // If we don't get a new token, we are in trouble so logout.
                console.error('Error desconocido...haciendo logout');
                return this.authService.logout();
            }), catchError(error => {
                // If we don't get a new token, we are in trouble so logout.
                console.error('Error desconocido...haciendo logout', error);
                return this.authService.logout();
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
    return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
    });
  }
}
