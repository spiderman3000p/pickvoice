import { Component, QueryList, ViewChildren, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';

@Component({
    selector: "mat-select-cell",
    template: `
            <select #input [formControl]="formControl" class="form-control">
                <option *ngFor="let option of options" [value]="option[key]">{{option[display]}}</option>
            </select>
    `
})
export class SelectCell2Component implements ICellEditorAngularComp {
    private params: any;
    public options: any[];
    public formControl: FormControl;
    private value: any;
    @ViewChildren("input", { read: ViewContainerRef })
    public inputs: QueryList<any>;
    private focusedInput: number = 0;
    private display = '';
    private key = '';

    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
        this.key = this.params.key;
        this.display = this.params.display;
        this.options = this.params.options();
        this.formControl = new FormControl(this.value);
    }

    ngAfterViewInit() {
     
    }

    getValue() {
        return this.formControl.value;
    }

    isPopup(): boolean {
        return false;
    }
}