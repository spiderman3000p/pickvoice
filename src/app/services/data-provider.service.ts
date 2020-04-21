import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transport, Location, Item, UomService, SectionService, OrderService, OrderTypeService,
         LocationsService, TransportService, LoadPickService, ItemTypeService, ItemsService,
         CustomerService, PickPlanning, Dock, PickTaskService, PickPlanningService, PickTask,
         DockService, UserService, ItemUomService, QualityStates, QualityStatesService,
         QualityStateTypeService } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from './utilities.service';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { of, Observable } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
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
    private transportService: TransportService, private httpClient: HttpClient,
    private pickTaskService: PickTaskService, private pickPlanningService: PickPlanningService,
    private docksService: DockService, private userService: UserService,
    private itemUomService: ItemUomService, private qualityStateService: QualityStatesService,
    private qualityStateTypeService: QualityStateTypeService) {
  }

  createObject(type: string, toUpload: any, observe: string = 'body', reportProgress: boolean = false) {
    if (type === IMPORTING_TYPES.ITEMS) {
      return this.createItem(toUpload, 'response', false);
    }

    if (type === IMPORTING_TYPES.LOCATIONS) {
      return this.createLocation(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ORDERS) {
      return this.createOrder(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ITEM_TYPE) {
      return this.createItemType(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ITEMUOMS) {
      return this.createItemUom(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.QUALITY_STATE_TYPES) {
      return this.createQualityStateType(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.QUALITY_STATES) {
      return this.createQualityState(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.UOMS) {
      return this.createUom(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.CUSTOMERS) {
      return this.createCustomer(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ORDER_TYPE) {
      return this.createOrderType(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.SECTIONS) {
      return this.createSection(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.TRANSPORTS) {
      return this.createTransport(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.PICK_PLANNINGS) {
      return this.createPickPlanning(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.PICK_TASKS) {
      /* return this.createPickTask(toUpload, 'response').pipe(retry(3));*/ 
    }

    if (type === IMPORTING_TYPES.PICK_TASKLINES) {
      /*return this.createPickTaskLine(toUpload, 'response').pipe(retry(3));*/
    }

    if (type === IMPORTING_TYPES.DOCKS) {
      return this.createDock(toUpload, 'response').pipe(retry(3));
    }
    return of({});
  }

  updateObject(type: string, toUpload: any, id: number): Observable<any> {
    if (type === IMPORTING_TYPES.ITEMS) {
      return this.updateItem(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.LOCATIONS) {
      return this.updateLocation(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.LOADORDERS_DTO) {
      return this.updateOrder(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ITEM_TYPE) {
      return this.updateItemType(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ORDERS) {
      return this.updateOrder(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.ORDER_TYPE) {
      return this.updateOrderType(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.UOMS) {
      return this.updateUom(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.TRANSPORTS) {
      return this.updateTransport(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.SECTIONS) {
      return this.updateSection(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.CUSTOMERS) {
      return this.updateCustomer(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.PICK_PLANNINGS) {
      return this.updatePickPlanning(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.PICK_TASKS) {
      return this.updatePickTask(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.DOCKS) {
      return this.updateDock(toUpload, id, 'response').pipe(retry(3));
    }
    return of(null);
  }

  getDataFromApi(type: any, params = '', errorHandler?: any, id?: number): Observable<any> {
    let toReturn: Observable<any>;
    switch (type) {
      case IMPORTING_TYPES.CUSTOMERS: {
        this.utilities.log(`obteniendo customers...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/customerList/' + params)
          .pipe(retry(3));
        } else {
          toReturn = this.customerService.retrieveAllCustomers().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.ITEM_TYPE: {
        this.utilities.log(`obteniendo item types...`);
        toReturn = this.itemTypeService.retrieveAllItemTypes().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ITEM_STATE: {
        this.utilities.log(`obteniendo item states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Item.StateEnum)));
        break;
      }
      case IMPORTING_TYPES.QUALITY_STATE_TYPES: {
        this.utilities.log(`obteniendo quality state types...`);
        toReturn = this.qualityStateService.retrieveAllQualityStates().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.ITEMS: {
        this.utilities.log(`obteniendo items...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/itemList/' + params)
          .pipe(retry(3));
        } else {
          // toReturn = this.itemService.retrieveAllItems().pipe(retry(3));
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/itemList/startRow=0;endRow=1000;sort-sku=asc').pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.LOCATIONS: {
        this.utilities.log(`obteniendo locations...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/settings/locationsList/' + params)
          .pipe(retry(3));
        } else {
          toReturn = this.locationService.retrieveAllLocation().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.LOCATION_TYPE: {
        this.utilities.log(`obteniendo locations types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.LocationTypeEnum)));
        break;
      }
      case IMPORTING_TYPES.ORDERS: {
        this.utilities.log(`obteniendo orders...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/console/outbound/orderList/all;' +
          params).pipe(retry(3));
        } else {
          toReturn = this.orderService.retrieveAllOrders().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.ORDERS_TO_ASSIGN: {
        this.utilities.log(`obteniendo orders con sin transporte asignado...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/console/outbound/ordersToAssign/all;' +
          params).pipe(retry(3));
        } else {
          toReturn = of([]);
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
      case IMPORTING_TYPES.PICK_PLANNINGS: {
        this.utilities.log(`obteniendo pick plannings...`);
        if (params) {
          toReturn = this.httpClient.get(environment.apiBaseUrl +
             '/console/outbound/pick/planningList/all;' + params).pipe(retry(3));
        } else {
          toReturn = this.pickPlanningService.retrieveAllPickPlanning().pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.PICK_TASKS: {
        if (id) {
          this.utilities.log(`obteniendo pick tasks de ${id}...`);
          toReturn = this.pickTaskService.taskByPickPlanning(id).pipe(retry(3));
        } else {
          toReturn = this.httpClient.get(environment.apiBaseUrl +
            '/console/outbound/pick/taskList/all;' + params).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.PICK_TASKLINES: {
        if (id) {
          this.utilities.log(`obteniendo pick tasks lines de ${id}...`);
          toReturn = this.pickTaskService.taskLineByPickTaskId(id).pipe(retry(3));
        } else {
          this.utilities.error('received id is invalid');
        }
        break;
      }
      case IMPORTING_TYPES.DOCKS: {
        this.utilities.log(`obteniendo dock...`);
        toReturn = this.getAllDocks().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TASK_STATE: {
        this.utilities.log(`obteniendo pick task states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(PickTask.TaskStateEnum)));
        break;
      }
      case IMPORTING_TYPES.PICK_STATE: {
        this.utilities.log(`obteniendo pick planning states...`);
        toReturn = this.getAllPickPlanningStates().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.USERS: {
        this.utilities.log(`obteniendo users...`);
        toReturn = this.getAllUsers().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TASK_TYPES: {
        this.utilities.log(`obteniendo pick task types...`);
        toReturn = this.getAllPickTaskTypes().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.DOCK_TYPE: {
        this.utilities.log(`obteniendo dock types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Dock.DockTypeEnum)));
        break;
      }
      case IMPORTING_TYPES.ITEM_CLASSIFICATIONS: {
        this.utilities.log(`obteniendo item classifications...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Item.ClassificationEnum)));
        break;
      }
      default: toReturn = new Observable(suscriber => {
        suscriber.error(`El tipo de dato '${type}' no tiene un metodo api asociado`);
        suscriber.next([]);
        suscriber.complete();
      });
    }
    return toReturn;
  }
  /**********************************************************************************
    Grupo de metodos para items
  ***********************************************************************************/
  public getAllUsers(observe: any = 'body', reportProgress = false): Observable<any[]> {
    return this.httpClient.get<any[]>('https://tau-tech.co:8443/api/settings/user');
    // return of([]);
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
    Grupo de metodos para item uoms
  ***********************************************************************************/
  public getAllItemUoms(idItem: number, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.itemUomByItemId(idItem, observe, reportProgress);
  }

  public deleteItemUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.deleteItemUom(id, observe, reportProgress);
  }

  public updateItemUom(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.updateItemUom(data, id, observe, reportProgress);
  }

  public createItemUom(data: any, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.createItemUom(data, observe, reportProgress);
  }

  public createItemUomList(data: any, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.createItemUomList(data, observe, reportProgress);
  }

  public getItemUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.retrieveItemUom(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para quality state
  ***********************************************************************************/
  public getAllQualityStates(observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.retrieveAllQualityStates(observe, reportProgress);
  }

  public deleteQualityState(id: number, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.deleteQualityStates(id, observe, reportProgress);
  }

  public updateQualityState(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.updateQualityStates(data, id, observe, reportProgress);
  }

  public createQualityState(data: any, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.createQualityStates(data, observe, reportProgress);
  }

  public getQualityState(id: number, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.retrieveQualityStatesById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para quality state types
  ***********************************************************************************/
  public getAllQualityStateTypes(observe: any = 'body', reportProgress = false) {
    return this.qualityStateTypeService.retrieveAllQualityStateType(observe, reportProgress);
  }

  public deleteQualityStateType(id: number, observe: any = 'body', reportProgress = false) {
    // return this.qualityStateTypeService.(id, observe, reportProgress);
  }

  public updateQualityStateType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    // return this.qualityStateService.updateQualityStates(data, id, observe, reportProgress);
  }

  public createQualityStateType(data: any, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.createQualityStates(data, observe, reportProgress);
  }

  public getQualityStateType(observe: any = 'body', reportProgress = false) {
    return of({});
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

  public updateOrdersTransport(data: any[], idTransport: number, observe: any = 'body', reportProgress = false) {
    // return this.orderService.updateOrder(data, id, observe, reportProgress);
    return this.httpClient.post(environment.apiBaseUrl +
      '/console/outbound/orders/assignmentTransport?idTransport=' + idTransport, data);
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

  public getTransportsOrders(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.orderByTransport(id, observe, reportProgress);
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
  /**********************************************************************************
    Grupo de metodos para pick planning
  ***********************************************************************************/
  public getAllPickPlannings(observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.retrieveAllPickPlanning(observe, reportProgress);
  }

  public getAllPickPlanningTasks(pickPlanningId: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.taskByPickPlanning(pickPlanningId, observe, reportProgress);
  }

  public getAllPickPlanningStates(observe: any = 'body', reportProgress = false): Observable<string[]> {
    return new Observable(suscriber  => suscriber.next(Object.keys(PickPlanning.StateEnum)));
  }

  public getPickPlanningTransport(id: number, observe: any = 'body', reportProgress = false) {
    // TODO: recuperar este metodo
    return this.transportService.findByPickPlanning(id, observe, reportProgress);
  }

  public deletePickPlanning(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.deletePickPlanning(id, observe, reportProgress);
  }

  public updatePickPlanning(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.updatePickPlanning(data, id, observe, reportProgress);
  }

  public createPickPlanning(data: any, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.createPickPlanning(data, observe, reportProgress);
  }

  public getPickPlanning(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.retrievePickPlanning(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para pick task
  ***********************************************************************************/
  public getAllPickTasks(observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.retrieveAllPickTask(observe, reportProgress);
  }

  public getAllPickTasksByPickPlanning(pickPlanningId: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.taskByPickPlanning(pickPlanningId, observe, reportProgress);
  }

  public getAllPickTasksByUser(user: string, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.retrievePickTaskByUser(user, observe, reportProgress);
  }

  public getAllPickTaskLinesByTask(idTask: number, observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task lines de task: ', idTask);
    return this.pickTaskService.taskLineByPickTaskId(idTask, observe, reportProgress);
  }

  public getAllPickTaskTypes(observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task types');
    // TODO: agregar servcicio real
    return new Observable(suscriber  => suscriber.next(Object.keys(PickTask.TaskStateEnum)));
  }

  public getAllPickTaskStates(observe: any = 'body', reportProgress = false): Observable<string[]> {
    console.log('obteniendo task states');
    return new Observable(suscriber  => suscriber.next(Object.keys(PickTask.TaskStateEnum)));
  }

  public getPickTask(id: number, observe: any = 'body', reportProgress = false) {
    console.log('obteniendo task');
    return this.pickTaskService.retrievePickTask(id, observe, reportProgress);
  }

  public deletePickTask(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.deletePickTask(id, observe, reportProgress);
  }

  public updatePickTask(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.updatePickTask(data, id, observe, reportProgress);
  }

  /*public activatePickTask(data: any[], observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.changePickTaskStatus(data, PickTask.TaskStateEnum.AC, observe, reportProgress);
  }

  public updateStatePickTask(data: any[], state: PickTask.TaskStateEnum, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.changePickTaskStatus(data, state, observe, reportProgress);
  }*/

  public updateStatePickTaskList(data: any[], state: string, observe: any = 'body', reportProgress = false) {
    // return this.orderService.updateOrder(data, id, observe, reportProgress);
    /*return this.httpClient.put(environment.apiBaseUrl +
      '/console/outbound/pick/changePickTaskStatus?codeState=' + status, data);*/
      return this.pickTaskService.changePickTaskStatus(data, state, observe, reportProgress);
  }

  public assignUserToPickTask(data: any, user: any, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.assignUserPickTask(data, user.userName);
  }

  public assignUserToPickTaskList(data: any[], user: any, observe: any = 'body', reportProgress = false) {
    // return this.pickTaskService.assignUserPickTask(data, user.userName);
    return this.httpClient.put(environment.apiBaseUrl +
      '/console/outbound/pick/assignUserPickTask?userName=' + user.userName, data);
  }

  public getTasksByPickPlanning(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.taskByPickPlanning(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para docks
  ***********************************************************************************/
  public getAllDocks(observe: any = 'body', reportProgress = false) {
    return this.docksService.retrieveAllDocks(observe, reportProgress);
  }

  public deleteDock(id: number, observe: any = 'body', reportProgress = false) {
    return this.docksService.deleteDock(id, observe, reportProgress);
  }

  public updateDock(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.docksService.updateDock(data, id, observe, reportProgress);
  }

  public createDock(data: any, observe: any = 'body', reportProgress = false) {
    return this.docksService.createDock(data, observe, reportProgress);
  }

  public getDock(id: number, observe: any = 'body', reportProgress = false) {
    return this.docksService.retrieveDockById(id, observe, reportProgress);
  }
}
