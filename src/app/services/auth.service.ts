import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';
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
  isLogged: boolean;
  redirectUrl: string;
  username: string;
  rememberUsername: string;
  remember: boolean;
  sessionStart: number;
  inactivityInterval: any;
  constructor(private userService: UserService, private utilities: UtilitiesService,
              private router: Router) { }
  // Dummy login function
  public login(username: string, password: string): Observable<any> {
    return this.userService.loginUser(username, password, 'response', false);
  }

  public logout(): Observable<any> {
    this.isLogged = false;
    this.redirectUrl = null;
    this.username = null;
    this.remember = null;
    this.rememberUsername = null;
    this.sessionStart = null;
    if (this.inactivityInterval !== undefined) {
      clearInterval(this.inactivityInterval);
    }
    localStorage.removeItem('username');
    localStorage.removeItem('rememberUsername');
    localStorage.removeItem('remember');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionStart');
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

  public getSessionStart() {
    let sessionStart = 0;
    if (!this.sessionStart) {
      if (localStorage.getItem('sessionStart')) {
        sessionStart = JSON.parse(localStorage.getItem('sessionStart'));
        this.sessionStart = sessionStart;
      }
    } else {
      sessionStart = this.sessionStart;
    }
    return sessionStart;
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
    let isLogged = false as boolean;
    let sessionStart = null;
    let remember = false as boolean;
    let sessionDuration = 0; // in minutes
    let lastActivity;
    let diffDates;
    if (!localStorage.getItem('last_activity')) {
      localStorage.setItem('last_activity', String(Date.now()));
      console.log('last_activity establecido en db', String(Date.now()));
    }
    /*if (this.inactivityInterval !== undefined) {
      clearInterval(this.inactivityInterval);
      this.inactivityInterval = undefined;
    }
    if (this.inactivityInterval === undefined) {
      this.inactivityInterval = setInterval(() => {
        lastActivity = Number(localStorage.getItem('last_activity'));
        console.log('lastActivity', lastActivity);
        diffDates = (Date.now() - lastActivity) / (1000 * 60);
        if (diffDates > SESSION_INACTIVITY_TIME) {
          console.error(`inactivity es mayor que ${SESSION_INACTIVITY_TIME}`, diffDates);
          this.logout();
          isLogged = false;
          this.router.navigate(['/login']);
        } else {
          console.log('tiempo de inactividad', diffDates);
          localStorage.setItem('last_activity', String(Date.now()));
        }
      }, 30000);
    }*/
    if (this.isLogged === undefined) {
      if (localStorage.getItem('isLoggedIn') && localStorage.getItem('sessionStart')) {
        isLogged = JSON.parse(localStorage.getItem('isLoggedIn'));
      }
    } else {
      isLogged = this.isLogged;
    }
    sessionStart = this.getSessionStart();
    remember = this.getRemember();
    sessionDuration = ((Date.now() - sessionStart) / (1000 * 60));
    if ((sessionDuration > SESSION_DURATION && remember) ||
        (sessionDuration < SESSION_DURATION)) {
      this.isLogged = isLogged;
      this.sessionStart = sessionStart;
    } else if (sessionDuration > SESSION_DURATION && !remember) {
      this.logout();
      isLogged = false;
    }
    return isLogged;
  }

  public setLoggedIn(value: boolean) {
    this.isLogged = value;
    localStorage.setItem('isLoggedIn', value.toString());
  }

  public setUsername(value: string) {
    this.username = value;
    localStorage.setItem('username', value);
  }

  public setSessionStart(value: number) {
    this.sessionStart = value;
    localStorage.setItem('sessionStart', value.toString());
  }

  public setRemember(value: boolean) {
    this.remember = value;
    localStorage.setItem('remember', value.toString());
    localStorage.setItem('rememberUsername', this.username);
    localStorage.setItem('username', this.username);
  }
}
