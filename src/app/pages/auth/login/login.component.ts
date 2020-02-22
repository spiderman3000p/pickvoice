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

  }

  doLogin() {
    console.log('Doing violin...', this.username, this.password);
    this.isLoadingResults = true;
    this.autService.login(this.username.value, this.password.value).pipe(retry(3)).subscribe(result => {
      this.isLoadingResults = false;
      console.log('resultado del login', result);
      if (result) {
        this.autService.isLoggedIn = true;
        this.autService.username = this.username.value;
        if (this.remember) {
          localStorage.setItem('remember', 'true');
          localStorage.setItem('remember_username', this.username.value);
        }
        this.utilities.showSnackBar(`Welcome ${this.username.value}`, '');
        this.router.navigate(['/pages']);
      }
    }, error => {
      this.isLoadingResults = false;
      this.utilities.showSnackBar('Error on login', 'OK');
      console.error('Error on login', error);
    });
  }

  ngOnInit() {
  }

}
