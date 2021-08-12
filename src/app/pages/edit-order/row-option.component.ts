import {
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-row-option',
  template: `
  <button type="button" color="primary" *ngIf="params.viewMode()" mat-icon-button (click)="deleteOrderLine($event)">
    <mat-icon>delete</mat-icon>
  </button>
  <!--button type="button" color="primary" mat-icon-button (click)="startEditOrderLine($event)" *ngIf="!isEditing">
    <mat-icon>edit</mat-icon>
  </button-->
  <button type="button" color="primary" mat-icon-button (click)="finishEditOrderLine($event)" *ngIf="isEditing">
    <mat-icon>check</mat-icon>
  </button>
  `,
  styles: [`
  .mat-icon-button{
    line-height: 26px;
    height: 26px;
    width: 26px;
  }
  `]
})
export class RowOptionComponent {
  params: any;
  isEditing = false;
  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    /*document.addEventListener('keydown', (event) => {
      if (event.key && event.key === 'Enter') {
        event.stopPropagation();
      }
    });*/
  }

  deleteOrderLine(event) {
    if (this.params.deleteOrderLine instanceof Function) {
      console.log('event', event);
      console.log('params', this.params);
      console.log('paramas.node.data', this.params.node.data);
      const params = {
        rowData: this.params.node.data
      };
      this.params.deleteOrderLine(params);
    }
  }

  startEditOrderLine(event) {
    this.isEditing = true;
    if (this.params.startEditOrderLine instanceof Function) {
      console.log('event', event);
      console.log('paramas.node', this.params.node);
      const params = {
        rowData: this.params.node.data
      };
      this.params.startEditOrderLine(params, this.params.node.rowIndex, 'itemId');
    }
  }

  finishEditOrderLine(event) {
    this.isEditing = false;
    if (this.params.finishEditOrderLine instanceof Function) {
      console.log('event', event);
      console.log('paramas', this.params);
      console.log('paramas.node.data', this.params.node.data);
      const params = {
        rowData: this.params.node.data
      };
      this.params.finishEditOrderLine(params);
    }
  }
}
