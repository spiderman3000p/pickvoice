import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
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
  constructor(
    private autService: AuthService, private utilities: UtilitiesService, private router: Router) {
      this.utilities.log('last url', this.autService.redirectUrl);
  }

  doLogin() {
    let message: string;
    this.utilities.log('Doing login ...', `${this.username}, ${this.password}`);
    this.isLoadingResults = true;
    this.autService.login(this.username.value, this.password.value).pipe(retry(3))
    .subscribe(response => {
      this.isLoadingResults = false;
      this.utilities.log('resultado del login', response);
      if (response && response.status === 200 && response.ok === true && response.body.status === 'OK') {
        this.enter();
      }
      if (response && response.status === 200 && response.body.status === 'INTERNAL_SERVER_ERROR') {
        if (response.body.message) {
          message = response.body.message;
        } else {
          message = 'Error on login';
        }
        this.utilities.showSnackBar(message, 'OK');  
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.error('Error on login', error);
      if (error && error.status === 500 && error.error.status === 'INTERNAL_SERVER_ERROR') {
        if (error.error.message) {
          message = error.error.message;
        } else {
          message = 'Error on login';
        }
        this.utilities.showSnackBar(message, 'OK');  
      }
    });
  }

  enter() {
    this.autService.setLoggedIn(true);
    this.autService.setUsername(this.username.value);
    this.autService.setSessionStart(Date.now());
    this.autService.setRemember(this.remember);

    this.utilities.showSnackBar(`Welcome ${this.username.value}`, '');
    this.router.navigate(['/pages']);
  }

  ngOnInit() {
  }

}
