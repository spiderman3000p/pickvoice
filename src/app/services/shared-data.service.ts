import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedDataService {
    public data: any; // usada para alojar los rows de la tabla de la pagina import
    public dataType: Subject<any>; // se refiere al tipo de importacion: items, locations, orders
    public sheets: Subject<any[]>; // guarda las paginas del archivo excel/txt/csv parseado
    public fileName: Subject<any>; // guarda el nombre del archivo parseado
    public rowData: Subject<any[]>; /* guarda los datos de un registro en particular para usarlos
    en el componente importing-widget, en la pagina de preview, por ag-grid*/
    public columnDefs: Subject<any[]>; /* guarda la definicion de columnas del archivo parseado
    para usarlos en el componente importing-widget, en la pagina de preview, por ag-grid*/
    public filePath: string; /* guarda el path del archivo seleccionado, no es subject porque
    no se requiere obtener su cambio en tiempo real
    */
    public sharedData: any; // para guardar el datos enviados de un componente a otro
    public returnData: any; // para guardar los datos devueltos por el componente
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
