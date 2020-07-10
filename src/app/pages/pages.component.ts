import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../services/auth.service';
import { UtilitiesService } from '../services/utilities.service';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { timer, Subscription } from 'rxjs';
import { ChangeUserDataComponent } from '../components/change-user-data/change-user-data.component';
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
      target: '_self',
      children: []
    },
    {
      text: 'Maintenance',
      icon: 'settings',
      route: '',
      target: '_self',
      children: [
        {
          text: 'Import',
          icon: 'upload',
          route: '/pages/import',
          target: '_self',
          children: []
        },
        {
          text: 'Recent Origins',
          icon: 'clock',
          route: '/pages/recent-origins',
          target: '_self',
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
              target: '_self',
              children: []
            },
            {
              text: 'Item Types',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ITEM_TYPE,
              target: '_self',
              children: []
            },
            {
              text: 'Uoms',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.UOMS,
              target: '_self',
              children: []
            },
            {
              text: 'Quality States',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.QUALITY_STATES,
              target: '_self',
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
              target: '_self',
              children: []
            },
            {
              text: 'Docks',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.DOCKS,
              target: '_self',
              children: []
            },
            {
              text: 'Sections',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.SECTIONS,
              target: '_self',
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
              target: '_self',
              children: []
            },
            {
              text: 'Order Types',
              icon: 'home',
              route: '/pages/' + IMPORTING_TYPES.ORDER_TYPE,
              target: '_self',
              children: []
            },
            {
              text: 'Template Designer',
              icon: 'home',
              route: '../edit-templates',
              target: '_blank',
              children: []
            },
            {
              text: 'Task Types',
              icon: '',
              route: '/pages/' + IMPORTING_TYPES.TASK_TYPES,
              target: '_self',
              children: []
            },
            {
              text: 'Plants',
              icon: '',
              route: '/pages/plants',
              target: '_self',
              children: []
            },
            {
              text: 'Depots',
              icon: '',
              route: '/pages/depots',
              target: '_self',
              children: []
            },
            {
              text: 'Owners',
              icon: '',
              route: '/pages/owners',
              target: '_self',
              children: []
            },
            {
              text: 'Lpn Intervals',
              icon: '',
              route: '/pages/lpnInterval',
              target: '_self',
              children: []
            }
          ]
        }
      ]
    },
    {
      text: 'Inbound',
      icon: 'center_focus_strong',
      route: '/pages/pending-orders',
      target: '_self',
      children: []
    },
    {
      text: 'Outbound',
      icon: 'crop_din',
      route: '/pages/current-actions',
      target: '_self',
      children: [
        {
          text: 'Orders',
          icon: 'home',
          route: '/pages/' + IMPORTING_TYPES.ORDERS,
          target: '_self',
          children: []
        },
        {
          text: 'Transports',
          icon: 'home',
          route: '/pages/' + IMPORTING_TYPES.TRANSPORTS,
          target: '_self',
          children: []
        },
        {
          text: 'Picking Planning',
          icon: '',
          route: '/pages/' + IMPORTING_TYPES.PICK_PLANNINGS,
          target: '_self',
          children: []
        },
        {
          text: 'Picking Tasks',
          icon: '',
          route: '/pages/' + IMPORTING_TYPES.PICK_TASKS,
          target: '_self',
          children: []
        }
      ]
    },
    {
      text: 'Storage',
      icon: 'all_inbox',
      route: '',
      target: '_self',
      children: [
        {
          text: 'Lpns',
          icon: '',
          route: '/pages/lpn',
          target: '_self',
          children: []
        },
        {
          text: 'Lpn relocate',
          icon: '',
          route: '/pages/lpn-relocate',
          target: '_self',
          children: []
        },
        {
          text: 'Lpn transfer',
          icon: '',
          route: '/pages/lpn-transfer',
          target: '_self',
          children: []
        },
        {
          text: 'Inventory',
          icon: '',
          route: '/pages/inventory',
          target: '_self',
          children: []
        }
      ]
    }
  ];
  subscriptions: Subscription[] = [];
  internetStatus = 'online';
  internetStatusMessage = '';
  showInternetStatus = false;
  memberData: any;
  private _mobileQueryListener: () => void;
  
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private authService: AuthService, private utilities: UtilitiesService,
              private router: Router, private dialog: MatDialog) {
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
    this.memberData = this.authService.getUserMemberData();
    this.utilities.log('member data: ', this.memberData);
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

  changeUserData() {
    const dialogRef = this.dialog.open(ChangeUserDataComponent, {
      width: '400px',
      data: {
        remoteSync: true, // para mandar los datos a la BD por la API
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result !== undefined && result !== null) {
        this.authService.setUserMemberData(result);
        location.reload();
      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
