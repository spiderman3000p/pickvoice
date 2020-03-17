import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { UtilitiesService } from '../services/utilities.service';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';
import { IMPORTING_TYPES } from '../models/model-maps.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy  {
  username: string;
  mobileQuery: MediaQueryList;
  menuOptions = [
    {
      text: 'Picking',
      icon: 'pin_drop',
      route: '/pages/picking',
      children: []
    },
    {
      text: 'Maintenance',
      icon: 'settings',
      route: '',
      children: [
        {
          text: 'Import',
          icon: 'upload',
          route: '/pages/import',
          children: []
        },
        {
          text: 'Recent Origins',
          icon: 'clock',
          route: '/pages/recent-origins',
          children: []
        },
        {
          text: 'Settings',
          icon: 'settings',
          route: '',
          children: [
            {
              text: 'Items',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ITEMS,
              children: []
            },
            {
              text: 'Locations',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.LOCATIONS,
              children: []
            },
            {
              text: 'Orders',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ORDERS,
              children: []
            },
            {
              text: 'Item Types',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ITEM_TYPE,
              children: []
            },
            {
              text: 'Uoms',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.UOMS,
              children: []
            },
            {
              text: 'Customers',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.CUSTOMERS,
              children: []
            },
            {
              text: 'Order Types',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ORDER_TYPE,
              children: []
            },
            {
              text: 'Sections',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.SECTIONS,
              children: []
            }
          ]
        }
      ]
    },
    {
      text: 'Administration',
      icon: 'supervisor_account',
      route: '/pages/administration',
      children: [
        {
          text: 'Pending Orders',
          icon: 'restore',
          route: '/pages/pending-orders',
          children: []
        },
        {
          text: 'Current Actions',
          icon: 'query_builder',
          route: '/pages/current-actions',
          children: []
        }
      ]
    }
  ];

  private _mobileQueryListener: () => void;
  
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService, private utilities: UtilitiesService,
              private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.username = this.authService.getUsername();
  }

  logout() {
    const observer = {
      next: (response) => {
        if (response === true) {
          this.utilities.log('loggin out...');
          this.authService.logout().subscribe(result => {
            this.utilities.log('logout response', result);
            if (result) {
              this.utilities.log('redirecting to /');
              this.router.navigate(['/login']);
            }
          }, error => {
            this.utilities.log('error on logout');
            this.utilities.showSnackBar('Error requesting logout', 'OK');
          });
        }
      },
      error: (error) => {
        this.utilities.error('Error after close common dialog', error);
        this.utilities.showSnackBar('Error after close common dialog', 'OK');
      }
    } as Observer<any>;
    this.utilities.showCommonDialog(observer, {
      title: 'Logout',
      message: 'Are you sure to logout?'
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
