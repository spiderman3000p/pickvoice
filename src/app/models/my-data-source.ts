import { Component } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { DataProviderService } from '../services/data-provider.service';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, retry, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class MyDataSource<T> implements DataSource<T> {
    public dataSubject = new BehaviorSubject<T[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public data: T[] = [];
    public dataCount = 100;
    public paginator: MatPaginator;
    public sort: MatSort;
    public lastRow = 0;
    public localData: T[] = [];
    public type = 'remote'; // remote | local
    constructor(private dataProviderService: DataProviderService, type: string = 'remote', data: any[] = []) {
        this.type = type;
        this.localData = data;
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.loadingSubject.complete();
        this.dataSubject.complete();
    }

    loadData(type: string, params: string): Observable<any> {
        this.loadingSubject.next(true);
        if (this.type === 'remote') {
            return this.dataProviderService.getDataFromApi(type, params).pipe(
                finalize(() => this.loadingSubject.next(false))
            );
        } else if (this.type === 'local') {
            return this.getFiltredLocalData(type, params).pipe(
                finalize(() => this.loadingSubject.next(false))
            );
        }
    }

    getFiltredLocalData(type: string, params: string = 'startRow=0;endRow=10000'): Observable<any> {
        let result = {
            content: [],
            pageSize: 0,
            pageNumber: 0,
            totalPages: 0,
            totalElements: 0
        };
        // console.log('getFiltredLocalData() this.localData: ', this.localData);
        if (this.localData) {
            const paramsArray = params.split(';');
            // console.log('paramsArray: ', paramsArray);
            let startRow;
            let endRow;
            paramsArray.forEach(param => {
                if (param.includes('startRow=')) {
                    startRow = Number(param.replace('startRow=', ''));
                } else if (param.includes('endRow=')) {
                    endRow = Number(param.replace('endRow=', ''));
                }
            });
            /*console.log('startRow: ', startRow);
            console.log('endRow: ', endRow);*/
            const subArray = this.localData.slice(startRow, endRow);
            // console.log('sub array: ', subArray);
            result = {
                content: subArray,
                pageSize: endRow - startRow,
                pageNumber: endRow / (endRow - startRow),
                totalPages: Math.floor(this.data.length / (endRow - startRow)),
                totalElements: this.data.length
            };
        }
        return of(result);
    }
}
