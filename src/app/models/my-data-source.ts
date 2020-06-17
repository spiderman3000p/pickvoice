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
    constructor(private dataProviderService: DataProviderService) {

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
        return this.dataProviderService.getDataFromApi(type, params).pipe(
            finalize(() => this.loadingSubject.next(false))
        );
    }
}
