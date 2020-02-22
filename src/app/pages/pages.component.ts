import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy  {
  mobileQuery: MediaQueryList;
  menuOptions = [
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
              route: '/pages/items',
              children: []
            },
            {
              text: 'Locations',
              icon: 'home',
              route: '/pages/locations',
              children: []
            },
            {
              text: 'Item Types',
              icon: 'home',
              route: '/pages/item-types',
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
  
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
