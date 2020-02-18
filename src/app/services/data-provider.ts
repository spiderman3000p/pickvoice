import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataStorage {
    public data: any;
    /*public sheets: Observable<any[]>;
    public fileName: Observable<any>;*/
    public dataType: Subject<any>;
    public sheets: Subject<any[]>;
    public fileName: Subject<any>;
    public rowData: Subject<any[]>;
    public columnDefs: Subject<any[]>;
    _fileName: string;
    _dataType: string;
    _sheets: any[];
    _rowData: any[];
    _columnDefs: any[];

    public constructor() {
        this.fileName = new Subject();
        this.sheets = new Subject();
        this.rowData = new Subject();
        this.dataType = new Subject();
        this.columnDefs = new Subject();
        this._fileName = '';
        this._dataType = '';
        this._sheets = [];
        this._rowData = [];
        this._columnDefs = [];
    }

    public setSheets(sheets: any[]) {
        this._sheets = sheets;
        this.sheets.next(sheets);
    }

    public setFileName(fileName: string) {
        this._fileName = fileName;
        this.fileName.next(fileName);
    }

    public setDataType(dataType: string) {
        this._dataType = dataType;
        this.dataType.next(dataType);
    }

    public setRowData(rowData: any[]) {
        this._rowData = rowData;
        this.rowData.next(rowData);
    }

    public setColumnDefs(columnDefs: any[]) {
        this._columnDefs = columnDefs;
        this.columnDefs.next(columnDefs);
    }

    public getFileName() {
        return this._fileName;
    }

    public getSheets() {
        return this._sheets;
    }

    public getRowData() {
        return this._rowData;
    }

    public getColumnDefs() {
        return this._columnDefs;
    }

    public getDataType() {
        return this._dataType;
    }
}
