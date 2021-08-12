import { Component, AfterViewInit } from "@angular/core";
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { concat, of, Subject, Observable } from 'rxjs';
import { tap, catchError, distinctUntilChanged, debounceTime, switchMap, finalize } from 'rxjs/operators';

@Component({
    selector: "mat-select-cell",
    template: `
            <ng-select [items]="options | async"
            [bindLabel]="display"
            [hideSelected]="false"
            [trackByFn]="trackByFn"
            [minTermLength]="2"
            typeToSearchText="Search..."
            [typeahead]="input$"
            (change)="onChange($event)"
            [(ngModel)]="value">
                <ng-template ng-label-tmp let-item="item">
                    [{{item.itemSku}}] {{item.itemDescription}}
                </ng-template>
                <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
                    [{{item.itemSku}}] {{item.itemDescription}}
                </ng-template>
            </ng-select>
    `,
    styles: [`::ng-deep .ag-cell-value.ag-cell-inline-editing {overflow: visible;}
    ::ng-deep .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{padding: 2px 5px;line-height: 20px;}
    ::ng-deep .ng-select {height: 100%;}
    ::ng-deep .ng-select .ng-select-container {min-height: 100%;}
    ::ng-deep .ng-select.ng-select-single .ng-select-container {height:100%}
    ::ng-deep .ag-row .form-control {height: 100%; padding: 2px 5px;}
    ::ng-deep .ag-row input{height:100%}`]
})
export class SelectCellComponent implements ICellEditorAngularComp, AfterViewInit {
    params: any;
    options: Observable<any>;
    value: any = {};
    display = '';
    key = '';
    loading = false;
    input$ = new Subject<string>();
    getUri = 'startRow=0;endRow=50';
    searchUri = 'startRow=0;endRow=50';
    searchTypeValue = 'string'
    agInit(params: any): void {
        this.params = params;
        const value = params.value;
        this.value = value;
        this.key = params.key ? params.key : this.key;
        this.display = params.display ? params.display : this.display;
        this.searchTypeValue = params.searchTypeValue ? params.searchTypeValue : this.searchTypeValue;
        this.getUri = params.getUri && params.value ? params.getUri : this.getUri;
        this.searchUri = params.searchUri ? params.searchUri : this.searchUri;
    }

    ngAfterViewInit() {
        let params;
        if (this.value && this.value[this.key]) {
            params = this.getUri.replace('$', this.value[this.key]);
        }
        this.params.options(params).subscribe((result: any) => {
            this.loadOptions(result.content);
        });
    }

    trackByFn(item: any) {
        return item[this.key];
    }

    private loadOptions(defaultOptions: any[]) {
        this.options = concat(
            of(defaultOptions), // default items
            this.input$.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                tap(() => this.loading = true),
                finalize(() => this.loading = false),
                switchMap((term: any = '') => {
                    // console.log('buscando por ', term);
                    if (!term) {
                        return of([]);
                    }
                    let params;
                    if (this.searchTypeValue === 'string' ) {
                        // console.log('term buscado es string');
                        term =  term.toLowerCase();
                    }
                    if (this.searchTypeValue === 'number') {
                        // console.log('term buscado es number');
                        term =  Number(term);
                    }
                    // console.log('term modificado', term);
                    params = this.searchUri.replace('$', term);
                    // console.log('search uri to use', params);
                    return this.params.options(params).pipe(
                        finalize(() => this.loading = false),
                        catchError(() => of([])), // empty list on error
                        switchMap((res: any) => {
                            this.loading = false;
                            // console.log('result content', res.content);
                            return of(res.content ? res.content : res);
                        })
                    );
                })
            )
        );
        this.options.subscribe(results => {
            this.loading = false;
            // console.log('subscribe results', results)
        });
    }

    getValue() {
        return this.value;
    }

    onChange(event: any) {
        // console.log('on change', event);
        this.value = event;
        this.params.data.item = event;
    }

    setValue(params) {
        // console.log('on set value', params);
        return this.value;
    }

    isPopup(): boolean {
        return false;
    }
}
