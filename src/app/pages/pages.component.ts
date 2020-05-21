import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { UtilitiesService } from '../services/utilities.service';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { timer, Subscription } from 'rxjs';
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
      text: 'Dashboard',
      icon: 'home',
      route: '/pages/dashboard',
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
          text: 'Item Master',
          icon: 'clock',
          children: [
            {
              text: 'Items',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ITEMS,
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
              text: 'Quality States',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.QUALITY_STATES,
              children: []
            }
          ]
        },
        {
          text: 'Location Master',
          icon: '',
          children: [
            {
              text: 'Locations',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.LOCATIONS,
              children: []
            },
            {
              text: 'Docks',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.DOCKS,
              children: []
            },
            {
              text: 'Sections',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.SECTIONS,
              children: []
            }
          ]
        },
        {
          text: 'Settings',
          icon: 'settings',
          route: '',
          children: [
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
          text: 'Inbound',
          icon: '',
          route: '/pages/pending-orders',
          children: []
        },
        {
          text: 'Outbound',
          icon: '',
          route: '/pages/current-actions',
          children: [
            {
              text: 'Orders',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ORDERS,
              children: []
            },
            {
              text: 'Transports',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.TRANSPORTS,
              children: []
            },
            {
              text: 'Picking Planning',
              icon: '',
              route: '/pages/' + IMPORTING_TYPES.PICK_PLANNINGS,
              children: []
            },
            {
              text: 'Picking Tasks',
              icon: '',
              route: '/pages/' + IMPORTING_TYPES.PICK_TASKS,
              children: []
            },
            {
              text: 'Task Types',
              icon: '',
              route: '/pages/' + IMPORTING_TYPES.TASK_TYPES,
              children: []
            }
          ]
        },
        {
          text: 'Storage',
          icon: '',
          route: '',
          children: [
            {
              text: 'Lpns',
              icon: '',
              route: '/pages/lpns',
              children: []
            },
            {
              text: 'Inventory',
              icon: '',
              route: '/pages/inventory',
              children: []
            }
          ]
        }
      ]
    }
  ];
  subscriptions: Subscription[] = [];
  internetStatus = 'online';
  internetStatusMessage = '';
  showInternetStatus = false;
  private _mobileQueryListener: () => void;
  
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService, private utilities: UtilitiesService,
              private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.username = this.authService.getUsername();
    this.subscriptions.push(this.utilities.internetStatus().subscribe((event: Event) => {
      this.utilities.log('Internet status event', event);
      if (event && event.type) {
        switch (event.type) {
          case 'offline': {
            this.internetStatusMessage = 'It seems you are offline right now. Please verify your Internet connection';
            this.utilities.showSnackBar('Internet connection has gone', 'OK');
            this.internetStatus = event.type;
            this.showInternetStatus = true;
            break;
          }
          case 'online': {
            let message = 'You are online';
            if (this.internetStatus === 'offline') {
              message = 'You are online again';
              this.utilities.showSnackBar(message, 'OK');
            }
            this.internetStatusMessage = message;
            this.internetStatus = event.type;
            this.showInternetStatus = true;
            this.subscriptions.push(timer(5000).subscribe(() => this.showInternetStatus = false));
          }
        }
      }
    }));
  }

  logout() {
    const observer = {
      next: (response) => {
        if (response === true) {
          this.utilities.log('loggin out...');
          this.subscriptions.push(this.authService.logout().subscribe(result => {
            this.utilities.log('logout response', result);
            if (result) {
              this.utilities.log('redirecting to /');
              this.router.navigate(['/login']);
            }
          }, error => {
            this.utilities.log('error on logout');
            this.utilities.showSnackBar('Error requesting logout', 'OK');
          }));
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
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
