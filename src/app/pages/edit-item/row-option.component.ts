import {
  AfterViewInit,
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
  private isEditing = false;
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
    if (this.params.deleteItemUom instanceof Function) {
      console.log('event', event);
      console.log('paramas', this.params);
      const params = {
        rowData: this.params.node.data
      };
      this.params.deleteItemUom(params);
    }
  }

  startEditRow(event) {
    this.isEditing = true;
    if (this.params.startEditItemUom instanceof Function) {
      console.log('event', event);
      console.log('paramas', this.params);
      const params = {
        rowData: this.params.node.data
      };
      this.params.startEditItemUom(params);
    }
  }

  finishEditRow(event) {
    this.isEditing = false;
    if (this.params.finishEditItemUom instanceof Function) {
      console.log('event', event);
      console.log('paramas', this.params);
      const params = {
        rowData: this.params.node.data
      };
      this.params.finishEditItemUom(params);
    }
  }
}
