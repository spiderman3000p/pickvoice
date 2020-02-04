import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('');
  password = new FormControl('');
  constructor(private autService: AuthService, private router: Router) {
  }

  doLogin() {
    console.log('Doing violin...', this.email, this.password);
    this.autService.login(this.email.value, this.password.value).subscribe(result => {
      console.log('resultado del login', result);
      if (result) {
        this.router.navigate(['/pages']);
      }
    });
  }

  ngOnInit() {
  }

}
