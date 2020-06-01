import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, finalize, switchAll, switchMap, tap, delay } from 'rxjs/operators';
import { UserService } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from './utilities.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const SESSION_DURATION = environment.sessionDuration;
const SESSION_INACTIVITY_TIME = environment.sessionInactivityTime;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static token;
  isRefreshingToken = false;
  sessionData = {
    access_token: null,
    expires_in: 0,
    refresh_expires_in: 0,
    token_type: null,
    refresh_token: null
  };
  isLogged: boolean;
  // redirectUrl: string;
  username: string;
  rememberUsername: string;
  remember: boolean;
  sessionStart: number;
  inactivityInterval: any;
  tokenRefreshInterval: any;
  constructor(private userService: UserService, private utilities: UtilitiesService,
              private router: Router, private httpClient: HttpClient) { }
  public static checkAccessToken() {
    let sessionToken = null;
    if (this.token === null) {
      if (localStorage.getItem('access_token')) {
        sessionToken = localStorage.getItem('access_token');
        this.token = sessionToken;
      }
    } else {
      sessionToken = this.token;
    }
    console.log('check session token: ', sessionToken);
    return sessionToken;
  }
  // Dummy login function
  public login(username: string, password: string): Observable<any> {
    const parameters = environment.keycloak_data;
    const payload = new HttpParams()
    .set('grant_type', parameters.grant_type)
    .set('client_id', parameters.client_id)
    .set('username', username)
    .set('password', password);
    return new Observable(suscriber => {
      this.httpClient.post(`${environment.apiKeycloak}/realms/cclrealm/protocol/openid-connect/token`,
      payload).subscribe((response: any) => {
        this.utilities.log('login response', response);
        if (response && response.access_token) {
          this.setLoggedIn(true);
          this.setSessionData(response);
          this.setSessionStart(Date.now());
          this.setUsername(username);
          this.setUnamed(password);
          suscriber.next({ logged: true, response: response, error: null});
        } else {
          suscriber.next({ logged: false, response: response, error: null});
        }
      }, error => {
        this.utilities.error('login error response', error);
        suscriber.next({ logged: false, response: null, error: error});
      }, () => {
        suscriber.complete();
      });
    });
  }

  refreshToken(): Observable<any> {
    const parameters = environment.keycloak_data;
    const payload = new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('client_id', parameters.client_id)
    .set('refresh_token', this.getRefreshToken());
    return  this.httpClient.post(`${environment.apiKeycloak}/realms/cclrealm/protocol/openid-connect/token`,
      payload).pipe(tap((response: any) => {
        if (response && response.access_token) {
          this.setRefreshToken(response.refresh_token);
          this.setSessionToken(response.access_token);
          this.setSessionStart(Date.now());
          this.utilities.log('Token refreshed');
        }
      }));
  }

  public logout(): Observable<any> {
    this.isLogged = false;
    // this.redirectUrl = null;
    this.username = null;
    this.remember = null;
    this.rememberUsername = null;
    this.sessionStart = null;
    AuthService.token = null;
    if (this.inactivityInterval !== undefined) {
      clearInterval(this.inactivityInterval);
    }
    if (this.tokenRefreshInterval !== undefined) {
      clearInterval(this.tokenRefreshInterval);
    }
    this.sessionData = {
      access_token: null,
      expires_in: 0,
      refresh_expires_in: 0,
      token_type: null,
      refresh_token: null
    };
    localStorage.removeItem('username');
    localStorage.removeItem('namedp');
    localStorage.removeItem('rememberUsername');
    localStorage.removeItem('remember');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('refresh_token');
    this.utilities.log('logout ready');
    return of(true);
  }

  public getUsername() {
    let username;
    if (!this.username) {
      if (localStorage.getItem('username')) {
        username = localStorage.getItem('username');
        this.username = username;
      }
    } else {
      username = this.username;
    }
    return username;
  }

  public getRefreshToken() {
    let token;
    if (!this.sessionData.refresh_token) {
      if (localStorage.getItem('refresh_token')) {
        token = localStorage.getItem('refresh_token');
        this.sessionData.refresh_token = token;
      }
    } else {
      token = this.sessionData.refresh_token;
    }
    return token;
  }

  public getUnamed() {
    let unamedp;
    if (localStorage.getItem('unamedp')) {
        unamedp = localStorage.getItem('unamedp');
    }
    return unamedp;
  }

  public getSessionStart() {
    let sessionStart = 0;
    if (!this.sessionStart) {
      if (localStorage.getItem('sessionStart')) {
        sessionStart = Number(JSON.parse(localStorage.getItem('sessionStart')));
        this.sessionStart = Number(sessionStart);
      }
    } else {
      sessionStart = this.sessionStart;
    }
    return sessionStart;
  }

  public getSessionToken() {
    let sessionToken = null;
    if (this.sessionData.access_token === null) {
      if (localStorage.getItem('access_token')) {
        sessionToken = localStorage.getItem('access_token');
        this.sessionData.access_token = sessionToken;
      }
    } else {
      sessionToken = this.sessionData.access_token;
    }
    // this.utilities.log('token: ', sessionToken);
    return sessionToken;
  }

  public getSessionExpiresIn() {
    let result = 0;
    if (this.sessionData.expires_in === 0) {
      if (localStorage.getItem('expires_in')) {
        this.utilities.log('recovering duration: ', localStorage.getItem('expires_in'));
        result = Number(localStorage.getItem('expires_in'));
        this.utilities.log('duration to number: ', result);
        this.sessionData.expires_in = result;
      }
    } else {
      result = this.sessionData.expires_in;
    }
    return result;
  }

  public getRemember() {
    let remember = false as boolean;
    if (this.remember === undefined) {
      if (localStorage.getItem('remember') && localStorage.getItem('rememberUsername')) {
        remember = JSON.parse(localStorage.getItem('remember'));
        this.remember = remember;
      }
    } else {
      remember = this.remember;
    }
    return remember;
  }

  public getRememberUsername() {
    let rememberUsername;
    if (this.rememberUsername === undefined) {
      if (localStorage.getItem('remember') && localStorage.getItem('rememberUsername')) {
        rememberUsername = JSON.parse(localStorage.getItem('rememberUsername'));
        this.remember = rememberUsername;
      }
    } else {
      rememberUsername = this.rememberUsername;
    }
    return rememberUsername;
  }

  public isLoggedIn() {
    if (this.tokenRefreshInterval === undefined) {
      this.setRefreshTokenInterval();
    }
    return (this.getSessionToken() !== null &&
    (Date.now() - this.getSessionStart()) < this.getSessionExpiresIn() * 1000);
  }

  public isTokenExpired() {
    const start = this.getSessionStart();
    const now = Date.now();
    const elapsed = now - start;
    // le quitamos un minuto para renovarlo antes de que expire
    const duration = (this.getSessionExpiresIn() - 60) * 1000;
    this.utilities.log(`start: ${start}, now: ${now}, elapsed: ${elapsed}, duration: ${duration}`);
    return elapsed >= duration;
  }

  public setLoggedIn(value: boolean) {
    this.isLogged = value;
    localStorage.setItem('isLoggedIn', value.toString());
  }

  public setUsername(value: string) {
    this.username = value;
    localStorage.setItem('username', value);
  }

  public setRefreshToken(value: string) {
    this.sessionData.refresh_token = value;
    localStorage.setItem('refresh_token', value);
  }

  public setUnamed(value: string) {
    localStorage.setItem('unamedp', value);
  }

  public setSessionStart(value: number) {
    this.sessionStart = value;
    localStorage.setItem('sessionStart', value.toString());
  }

  public setSessionToken(value: string) {
    this.sessionData.access_token = value;
    AuthService.token = value;
    localStorage.setItem('access_token', value);
  }

  public setSessionData(value: any) {
    this.sessionData.access_token = value.access_token;
    this.sessionData.expires_in = value.expires_in;
    this.sessionData.refresh_expires_in = value.refresh_expires_in;
    this.sessionData.token_type = value.token_type;
    this.sessionData.refresh_token = value.refresh_token;
    AuthService.token = value.access_token;
    localStorage.setItem('access_token', value.access_token);
    localStorage.setItem('refresh_token', value.refresh_token);
    localStorage.setItem('expires_in', value.expires_in);
    localStorage.setItem('refresh_expires_in', value.refresh_expires_in);
    localStorage.setItem('token_type', value.token_type);
    this.setRefreshTokenInterval();
  }

  private setRefreshTokenInterval() {
    this.tokenRefreshInterval = setInterval(() => {
      this.utilities.log('Verificando valides del token');
      if (this.isTokenExpired()) {
        this.utilities.log('Token expirado');
        if (!this.isRefreshingToken) {
          this.utilities.log('Solicitando nuevo token...');
          this.isRefreshingToken = true;
          this.refreshToken().pipe(switchMap((response: any) => {
            this.utilities.log('Respuesta al refrescar token: ', response);
            if (response && response.access_token) {
                this.utilities.log('Token regenerado con exito');
                this.isRefreshingToken = false;
                this.setRefreshToken(response.access_token);
            } else {
              // If we don't get a new token, we are in trouble so logout.
              this.utilities.error('Error desconocido al refrescar token...haciendo logout');
              this.logout();
              this.router.navigate(['/login']);
            }
            return of(true);
          }), catchError(error => {
              // If we don't get a new token, we are in trouble so logout.
              this.utilities.error('Error desconocido al refrescar token...haciendo logout', error);
              this.logout();
              this.router.navigate(['/login']);
              return of(true);
          }), finalize(() => {
              this.isRefreshingToken = false;
          })).subscribe();
        } else {
            this.utilities.log('Ya se esta refrescando el token...');
        }
      } else {
        this.utilities.log('Token valido');
      }
    }, 30000);
  }

  public setRemember(value: boolean) {
    this.remember = value;
    localStorage.setItem('remember', value.toString());
    localStorage.setItem('rememberUsername', this.username);
    localStorage.setItem('username', this.username);
  }
}
