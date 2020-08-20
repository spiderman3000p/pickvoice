import {
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-row-option',
  template: `
  <button type="button" color="primary" mat-icon-button (click)="deleteRow($event)">
    <mat-icon>delete</mat-icon>
  </button>
  <button type="button" color="primary" mat-icon-button (click)="startEditRow($event)" *ngIf="!isEditing">
    <mat-icon>edit</mat-icon>
  </button>
  <button type="button" color="primary" mat-icon-button (click)="finishEditRow($event)" *ngIf="isEditing">
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
  private params: any;
  public isEditing = false;
  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    document.addEventListener('keydown', (event) => {
      if (event.key && event.key === 'Enter') {
        event.stopPropagation();
      }
    });
  }

  deleteRow(event) {
    if (this.params.deleteStore instanceof Function) {
      console.log('event', event);
      console.log('params', this.params);
      console.log('paramas.node.data', this.params.node.data);
      const params = {
        rowData: this.params.node.data
      };
      this.params.deleteStore(params);
    }
  }

  startEditRow(event) {
    this.isEditing = true;
    if (this.params.startEditStore instanceof Function) {
      console.log('event', event);
      console.log('paramas.node', this.params.node);
      const params = {
        rowData: this.params.node.data
      };
      this.params.startEditStore(params, this.params.node.rowIndex, 'code');
    }
  }

  finishEditRow(event) {
    this.isEditing = false;
    if (this.params.finishEditStore instanceof Function) {
      console.log('event', event);
      console.log('paramas', this.params);
      console.log('paramas.node.data', this.params.node.data);
      const params = {
        rowData: this.params.node.data
      };
      this.params.finishEditStore(params);
    }
  }
}
