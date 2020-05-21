import { OnDestroy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = new FormControl('');
  password = new FormControl('');
  showPassword = false;
  remember = false;
  isLoadingResults = false;
  subscriptions: Subscription[] = [];
  constructor(
    private autService: AuthService, private utilities: UtilitiesService, private router: Router) {
      this.utilities.log('last url', this.autService.redirectUrl);
  }

  doLogin() {
    let message: string;
    // this.utilities.log('Doing login ...', `${this.username}, ${this.password}`);
    this.isLoadingResults = true;
    this.subscriptions.push(this.autService.login(this.username.value, this.password.value).pipe(retry(3))
    .subscribe(response => {
      this.isLoadingResults = false;
      this.utilities.log('resultado del login', response);
      if (response && response.logged) {
        this.enter();
        message = `Welcome ${this.username.value}`;
      } else if (response && !response.logged && response.error === null) {
        message = response.response.body.message;
      } else if (response && !response.logged && response.error !== null) {
        message = 'Error on login';
      }
      this.utilities.showSnackBar(message, 'OK');
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error on login', error);
      if (error) {
        if (error.error && error.error.message) {
          message = error.error.message;
        } else {
          message = 'Error on login';
        }
        this.utilities.showSnackBar(message, 'OK');
      }
    }));
  }

  enter() {
    this.autService.setUsername(this.username.value);
    this.autService.setRemember(this.remember);
    this.router.navigate(['/pages']);
  }

  ngOnInit() {
  }

}
