import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-my-context-menu',
  templateUrl: './my-context-menu.component.html',
  styleUrls: ['./my-context-menu.component.css']
})
export class MyContextMenuComponent implements OnInit {
  @Input()
  menuItems: any[];
  @Output()
  itemSelected: any;

  constructor() { }

  ngOnInit(): void {
  }

}
