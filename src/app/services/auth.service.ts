import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor() { }
  // Dummy login function
  login(email: string, password: string): Observable<boolean> {
    return of(true).pipe(delay(2000), tap(val => this.isLoggedIn = true));
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
