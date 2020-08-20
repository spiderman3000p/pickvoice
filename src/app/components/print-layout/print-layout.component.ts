import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit {
  title: string;
  companyName: string;
  companyEmail: string;
  companyPhones: string;
  companyAddress: string;
  footer: string;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.companyName = environment.companyName;
    this.companyEmail = environment.companyEmail;
    this.companyPhones = environment.companyPhones;
    this.companyAddress = environment.companyAddress;
    this.footer = environment.footer;
  }

  init() {
  }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {
      title: string
    }) => {
      this.title = data.title;
    });
  }

}
