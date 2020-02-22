import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { UserService } from '@pickvoice/pickvoice-api';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false;
  public redirectUrl: string;
  public username: string;

  constructor(private userService: UserService) { }
  // Dummy login function
  login(username: string, password: string): Observable<any> {
    return this.userService.loginUser(username, password, 'response', false);
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
