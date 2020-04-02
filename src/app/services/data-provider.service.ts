import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transport, Location, Item, UomService, SectionService, OrderService, OrderTypeService, LocationsService, TransportService,
         LoadPickService, ItemTypeService, ItemsService, CustomerService } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from './utilities.service';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  constructor(
    private utilities: UtilitiesService, private uomService: UomService,
    private orderTypeService: OrderTypeService, private locationService: LocationsService,
    private loadPickService: LoadPickService, private itemTypeService: ItemTypeService,
    private itemService: ItemsService, private customerService: CustomerService,
    private sectionService: SectionService, private orderService: OrderService,
    private transportService: TransportService, private httpClient: HttpClient) {
  }

  getDataFromApi(type: any, params?: string, errorHandler?: any): Observable<any> {
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
      case IMPORTING_TYPES.ITEM_STATE: {
        this.utilities.log(`obteniendo item states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Item.ItemStateEnum)));
        break;
      }
      case IMPORTING_TYPES.ITEMS: {
        this.utilities.log(`obteniendo items...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/itemList/' + params).pipe(retry(3));
        } else {
          toReturn = this.itemService.retrieveAllItems().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.LOCATIONS: {
        this.utilities.log(`obteniendo locations...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/locationsList/' + params).pipe(retry(3));
        } else {
          toReturn = this.locationService.retrieveAllLocation().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.LOCATION_TYPE: {
        this.utilities.log(`obteniendo locations types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.TypeEnum)));
        break;
      }
      case IMPORTING_TYPES.ORDERS: {
        this.utilities.log(`obteniendo orders...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/console/outbound/orderList/all;' + params).pipe(retry(3));
        } else {
          toReturn = this.orderService.retrieveAllOrders().pipe(retry(3));
        }
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
        this.utilities.log(`obteniendo transports...`);
        toReturn = this.transportService.retrieveAllTransport().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TRANSPORT_STATE: {
        this.utilities.log(`obteniendo transport states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Transport.TransportStateEnum)));
        break;
      }
      case IMPORTING_TYPES.UOMS: {
        this.utilities.log(`obteniendo uoms...`);
        toReturn = this.uomService.retrieveAllUom().pipe(retry(3));
        break;
      }
    }
    return toReturn;
  }
  /**********************************************************************************
    Grupo de metodos para items
  ***********************************************************************************/
  public getAllItems(observe: any = 'body', reportProgress = false) {
    return this.itemService.retrieveAllItems(observe, reportProgress);
  }

  public deleteItem(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemService.deleteItem(id, observe, reportProgress);
  }

  public updateItem(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.itemService.updateItem(data, id, observe, reportProgress);
  }

  public createItem(data: any, observe: any = 'body', reportProgress = false) {
    return this.itemService.createItem(data, observe, reportProgress);
  }

  public createItems(data: any[], observe: any = 'body', reportProgress = false) {
    return this.itemService.createItemsList(data, observe, reportProgress);
  }

  public getItem(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemService.retrieveItem(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para item types
  ***********************************************************************************/
  public getAllItemTypes(observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.retrieveAllItemTypes(observe, reportProgress);
  }

  public deleteItemType(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.deleteItemType(id, observe, reportProgress);
  }

  public updateItemType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.updateItemType(data, id, observe, reportProgress);
  }

  public createItemType(data: any, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.createItemType(data, observe, reportProgress);
  }

  public getItemtype(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.retrieveItemTypeById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para uoms
  ***********************************************************************************/
  public getAllUoms(observe: any = 'body', reportProgress = false) {
    return this.uomService.retrieveAllUom(observe, reportProgress);
  }

  public deleteUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.deleteUom(id, observe, reportProgress);
  }

  public updateUom(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.updateUom(data, id, observe, reportProgress);
  }

  public createUom(data: any, observe: any = 'body', reportProgress = false) {
    return this.uomService.createUom(data, observe, reportProgress);
  }

  public getUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.retrieveUomById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para locations
  ***********************************************************************************/
  public getAllLocations(observe: any = 'body', reportProgress = false) {
    return this.locationService.retrieveAllLocation(observe, reportProgress);
  }

  public deleteLocation(id: number, observe: any = 'body', reportProgress = false) {
    return this.locationService.deleteLocation(id, observe, reportProgress);
  }

  public updateLocation(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.locationService.updateLocation(data, id, observe, reportProgress);
  }

  public createLocation(data: any, observe: any = 'body', reportProgress = false) {
    return this.locationService.createLocation(data, observe, reportProgress);
  }

  public createLocations(data: any[], observe: any = 'body', reportProgress = false) {
    return this.locationService.createLocationsList(data, observe, reportProgress);
  }

  public getLocation(id: number, observe: any = 'body', reportProgress = false) {
    return this.locationService.retrieveLocation(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para sections
  ***********************************************************************************/
  public getAllSections(observe: any = 'body', reportProgress = false) {
    return this.sectionService.retrieveAllSections(observe, reportProgress);
  }

  public deleteSection(id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.deleteSection(id, observe, reportProgress);
  }

  public updateSection(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.updateSection(data, id, observe, reportProgress);
  }

  public createSection(data: any, observe: any = 'body', reportProgress = false) {
    return this.sectionService.createSection(data, observe, reportProgress);
  }

  public getSection(id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.retrieveSectionById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para orders
  ***********************************************************************************/
  public getAllOrders(observe: any = 'body', reportProgress = false) {
    return this.orderService.retrieveAllOrders(observe, reportProgress);
  }

  public deleteOrder(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.deleteOrder(id, observe, reportProgress);
  }

  public updateOrder(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.updateOrder(data, id, observe, reportProgress);
  }

  public createOrder(data: any, observe: any = 'body', reportProgress = false) {
    return this.orderService.createOrder(data, observe, reportProgress);
  }

  public createOrders(data: any[], observe: any = 'body', reportProgress = false) {
    return this.orderService.createOrderList(data, observe, reportProgress);
  }

  public getOrder(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.retrieveOrder(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para transport
  ***********************************************************************************/
  public getAllTransports(observe: any = 'body', reportProgress = false) {
    return this.transportService.retrieveAllTransport(observe, reportProgress);
  }

  public deleteTransport(id: number, observe: any = 'body', reportProgress = false) {
    return this.transportService.deleteTransport(id, observe, reportProgress);
  }

  public updateTransport(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.transportService.updateTransport(data, id, observe, reportProgress);
  }

  public createTransport(data: any, observe: any = 'body', reportProgress = false) {
    return this.transportService.createTransport(data, observe, reportProgress);
  }

  public getTransport(id: number, observe: any = 'body', reportProgress = false) {
    return this.transportService.retrieveTransport(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para order type
  ***********************************************************************************/
  public getAllOrderTypes(observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.retrieveAllOrderType(observe, reportProgress);
  }

  public deleteOrderType(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.deleteorderType(id, observe, reportProgress);
  }

  public updateOrderType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.updateorderType(data, id, observe, reportProgress);
  }

  public createOrderType(data: any, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.createOrderType(data, observe, reportProgress);
  }

  public getOrderType(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.retrieveorderTypeById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para customers
  ***********************************************************************************/
  public getAllCustomers(observe: any = 'body', reportProgress = false) {
    return this.customerService.retrieveAllCustomers(observe, reportProgress);
  }

  public deleteCustomer(id: number, observe: any = 'body', reportProgress = false) {
    return this.customerService.deleteCustomer(id, observe, reportProgress);
  }

  public updateCustomer(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.customerService.updateCustomer(data, id, observe, reportProgress);
  }

  public createCustomer(data: any, observe: any = 'body', reportProgress = false) {
    return this.customerService.createCustomer(data, observe, reportProgress);
  }

  public getCustomer(id: number, observe: any = 'body', reportProgress = false) {
    return this.customerService.retrieveCustomerById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para load picks
  ***********************************************************************************/
  public createLoadPicks(data: any[], observe: any = 'body', reportProgress = false) {
    return this.loadPickService.createLoadPick(data, observe, reportProgress);
  }
}
