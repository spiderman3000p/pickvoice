import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ICellEditorAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-numeric-cell',
  template: `
    <input type="date"
      #input
      [(ngModel)]="value"
      style="width: 100%"
    />
  `,
})
export class DateEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: string;
  private cancelBeforeStart = false;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    console.log('charPress', params.charPress);
    // only start edit if key pressed is a number, not a letter
    // this.cancelBeforeStart = params.charPress && '1234567890'.indexOf(params.charPress) < 0;
  }

  getValue(): any {
    return this.value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  // will reject the number if it greater than 1,000,000
  // not very practical, but demonstrates the method.
  isCancelAfterEnd(): boolean {
    return false;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.input.element.nativeElement.focus();
    });
  }
}