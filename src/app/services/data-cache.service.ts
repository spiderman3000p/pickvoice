import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UomService, SectionService, OrderService, OrderTypeService, LocationsService,
         LoadPickService, ItemTypeService, ItemsService, CustomerService } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from './utilities.service';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

interface CacheItem {
  data: any;
  timestamp: number;
  slug: any;
}
@Injectable({
  providedIn: 'root'
})
export class DataCacheService {
  cacheDuration = environment.dataCacheDuration;
  cachedData: CacheItem[];
  constructor(
    private utilities: UtilitiesService, private uomService: UomService,
    private orderTypeService: OrderTypeService, private locationService: LocationsService,
    private loadPickService: LoadPickService, private itemTypeService: ItemTypeService,
    private itemService: ItemsService, private customerService: CustomerService,
    private sectionService: SectionService, private orderService: OrderService) {
    this.initCachedData();
  }

  private initCachedData() {
    this.utilities.log('inicializando data cache...');
    let cacheItem: CacheItem;
    this.cachedData = [];
    for (const key in localStorage) {
      if (key.includes('cachedData_')) {
        cacheItem = new Object(JSON.parse(localStorage.getItem(key))) as CacheItem;
        this.cachedData.push(cacheItem);
      }
    }
    this.utilities.log('cache inicializada:', this.cachedData);
  }

  public getCachedData(type: string, slug: any, useCache = true): Observable<any> {
    this.utilities.log(`Solicitando cache de ${slug}...`);
    let toReturn: Observable<any>;
    const existentIndex = this.cachedData.findIndex((cacheItem) => cacheItem.slug === slug);
    const cachedDataItem = existentIndex > -1 ? this.cachedData[existentIndex] : null;
    if (cachedDataItem !== null && useCache) {
      this.utilities.log(`Cache de ${slug} encontrada:`, cachedDataItem);
      const elapsedTime = this.utilities.getElapsedTime(cachedDataItem.timestamp);
      this.utilities.log(`Antiguedad de ${slug}:`, elapsedTime);
      if (elapsedTime > this.cacheDuration) {
        this.utilities.log(`Cache de ${slug} vencida, se hara una peticion api...`);
        toReturn = this.getDataFromApi(type, slug);
      } else {
        this.utilities.log(`Cache de ${slug} valida`);
        toReturn = new Observable(suscriber => {
          suscriber.next(cachedDataItem.data);
          suscriber.complete();
        });
      }
    } else {
      this.utilities.log(`Cache de ${slug} no encontrada o ignorada`);
      toReturn = this.getDataFromApi(type, slug);
    }
    return toReturn;
  }

  getDataFromApi(type: any, slug: any): Observable<any> {
    let toReturn: Observable<any>;
    switch (type) {
      case IMPORTING_TYPES.CUSTOMERS: {
        this.utilities.log(`obteniendo customers...`);
        toReturn = this.customerService.retrieveAllCustomers().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ITEM_TYPE: {
        this.utilities.log(`obteniendo item types...`);
        toReturn = this.itemTypeService.retrieveAllItemTypes().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ITEMS: {
        this.utilities.log(`obteniendo items...`);
        toReturn = this.itemService.retrieveAllItems().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.LOCATIONS: {
        this.utilities.log(`obteniendo locations...`);
        toReturn = this.locationService.retrieveAllLocation().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ORDERS: {
        this.utilities.log(`obteniendo orders...`);
        toReturn = this.orderService.retrieveAllOrders().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ORDER_LINE: {
        break;
      }
      case IMPORTING_TYPES.ORDER_TYPE: {
        this.utilities.log(`obteniendo order types...`);
        toReturn = this.orderTypeService.retrieveAllOrderType().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.SECTIONS: {
        this.utilities.log(`obteniendo sections...`);
        toReturn = this.sectionService.retrieveAllSections().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TRANSPORTS: {
        break;
      }
      case IMPORTING_TYPES.UOMS: {
        this.utilities.log(`obteniendo uoms...`);
        toReturn = this.uomService.retrieveAllUom().pipe(retry(3));
        break;
      }
    }
    toReturn.subscribe(results => {
      this.utilities.log(`Resultados de solicitud para cache ${slug}:`, results);
      if (results && results.length > 0) {
        const cachedDataItem = new Object() as CacheItem;
        cachedDataItem.slug = slug;
        cachedDataItem.data = results;
        cachedDataItem.timestamp = new Date().getTime();
        this.cachedData.push(cachedDataItem);
        this.utilities.log(`Nueva cache para ${slug}:`, cachedDataItem);
        localStorage.setItem(`cachedData_${slug}`, JSON.stringify(cachedDataItem));
      }
    });
    return toReturn;
  }
}
