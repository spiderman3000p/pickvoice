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
export class SelectCellComponent implements ICellEditorAngularComp {
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

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        this.focusOnInputNextTick(this.inputs.first);
    }

    private focusOnInputNextTick(input: ViewContainerRef) {
        window.setTimeout(() => {
            input.element.nativeElement.focus();
        }, 0);
    }

    getValue() {
        return this.formControl.value;
    }

    isPopup(): boolean {
        return false;
    }

    /*
     * A little over complicated for what it is, but the idea is to illustrate how you might tab between multiple inputs
     * say for example in full row editing
     */
    onKeyDown(event): void {
        let key = event.which || event.keyCode;
        if (key == 9) {
            // tab
            this.preventDefaultAndPropagation(event);

            // either move one input along, or cycle back to 0
            this.focusedInput = this.focusedInput === this.inputs.length - 1 ? 0 : this.focusedInput + 1;

            let focusedInput = this.focusedInput;
            let inputToFocusOn = this.inputs.find((item: any, index: number) => {
                return index === focusedInput;
            });

            this.focusOnInputNextTick(inputToFocusOn);
        } else if (key == 13) {
            // enter
            // perform some validation on enter - in this example we assume all inputs are mandatory
            // in a proper application you'd probably want to inform the user that an input is blank
            this.inputs.forEach(input => {
                if (!input.element.nativeElement.value) {
                    this.preventDefaultAndPropagation(event);
                    this.focusOnInputNextTick(input);
                }
            });
        }
    }

    private preventDefaultAndPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}