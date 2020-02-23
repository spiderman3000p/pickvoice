import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';

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
    this.utilities.log('Doing login ...', `${this.username}, ${this.password}`);
    this.isLoadingResults = true;
    this.autService.login(this.username.value, this.password.value).pipe(retry(3))
    .subscribe(result => {
      this.isLoadingResults = false;
      this.utilities.log('resultado del login', result);
      if (result) {
        this.enter();
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.showSnackBar('Error on login', 'OK');
      this.utilities.error('Error on login', error);
      // this.enter();
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
