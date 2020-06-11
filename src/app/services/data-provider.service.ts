import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Transport, Location, Item, UomService, SectionService, OrderService, OrderTypeService,
         LocationService, TransportService, LoadPickService, ItemTypeService, ItemService,
         CustomerService, PickPlanning, Dock, PickTaskService, PickPlanningService, PickTask,
         DockService, UserService, ItemUomService, QualityStates, QualityStateService,
         QualityStateTypeService, TaskTypeService } from '@pickvoice/pickvoice-api';
import { UtilitiesService } from './utilities.service';
import { AuthService } from './auth.service';
import { IMPORTING_TYPES } from '../models/model-maps.model';
import { of, Observable } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { timeout, retry, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  constructor(
    private utilities: UtilitiesService, private uomService: UomService,
    private orderTypeService: OrderTypeService, private locationService: LocationService,
    private loadPickService: LoadPickService, private itemTypeService: ItemTypeService,
    private itemService: ItemService, private customerService: CustomerService,
    private sectionService: SectionService, private orderService: OrderService,
    private transportService: TransportService, private httpClient: HttpClient,
    private pickTaskService: PickTaskService, private pickPlanningService: PickPlanningService,
    private docksService: DockService, private userService: UserService,
    private itemUomService: ItemUomService, private qualityStateService: QualityStateService,
    private taskTypeService: TaskTypeService, private authService: AuthService,
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

    if (type === IMPORTING_TYPES.TASK_TYPES) {
      return this.createTaskType(toUpload, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.PICK_TASKLINES) {
      /*return this.createPickTaskLine(toUpload, 'response').pipe(retry(3));*/
    }

    if (type === IMPORTING_TYPES.DOCKS) {
      // TODO: revisar esto
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

    if (type === IMPORTING_TYPES.QUALITY_STATES) {
      return this.updateQualityState(toUpload, id, 'response').pipe(retry(3));
    }

    if (type === IMPORTING_TYPES.TASK_TYPES) {
      return this.updateTaskType(toUpload, id, 'response').pipe(retry(3));
    }
    return of(null);
  }

  getDataFromApi(type: any, params = 'startRow=0;endRow=10000', errorHandler?: any, id?: number): Observable<any> {
    let toReturn: any = of([]);
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    switch (type) {
      case IMPORTING_TYPES.INVENTORY: {
        if (owner !== null) {
          httpHeaders.append('ownerId', owner.toString());
          this.utilities.log(`obteniendo inventory...`);
          /*toReturn = this.httpClient.get(environment.apiBaseUrl + '/storage/lpnItemsVO1')
          .pipe(retry(3));*/
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/storage/lpnItemsVO1/' + params, {
            headers: httpHeaders
          }).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.CUSTOMERS: {
        toReturn = this.getAllCustomers(params);
        break;
      }
      case IMPORTING_TYPES.ITEM_TYPE: {
        if (owner !== null) {
          httpHeaders.append('ownerId', owner.toString());
          this.utilities.log(`obteniendo item types...`);
          toReturn = this.itemTypeService.retrieveAllItemTypes(owner).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.ITEM_STATE: {
        this.utilities.log(`obteniendo item states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Item.StateEnum)));
        break;
      }
      case IMPORTING_TYPES.QUALITY_STATE_TYPES: {
        this.utilities.log(`obteniendo quality state types...`);
        toReturn = this.qualityStateTypeService.retrieveAllQualityStateType().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.QUALITY_STATES: {
        if (owner !== null) {
          this.utilities.log(`obteniendo quality states...`);
          toReturn = this.qualityStateService.retrieveAllQualityStates(owner).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.ITEMS: {
        toReturn = this.getAllItems();
        break;
      }
      case IMPORTING_TYPES.ITEMS_LIST: {
        toReturn = this.getAllItems(params);
        break;
      }
      case IMPORTING_TYPES.LOCATIONS: {
        toReturn = this.getAllLocations(params);
        break;
      }
      case IMPORTING_TYPES.LOCATION_STATE: {
        this.utilities.log(`obteniendo locations states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.LocationStateEnum)));
        break;
      }
      case IMPORTING_TYPES.OPERATION_TYPE: {
        this.utilities.log(`obteniendo operation types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.OperationTypeEnum)));
        break;
      }
      case IMPORTING_TYPES.RACK_TYPE: {
        this.utilities.log(`obteniendo rack types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.RackTypeEnum)));
        break;
      }
      case IMPORTING_TYPES.LOCATION_TYPE: {
        this.utilities.log(`obteniendo locations types...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Location.LocationTypeEnum)));
        break;
      }
      case IMPORTING_TYPES.ORDERS: {
        toReturn = this.getAllOrders(params);
        break;
      }
      case IMPORTING_TYPES.ORDERS_TO_ASSIGN: {
        if (owner !== null) {
          httpHeaders.append('ownerId', owner.toString());
          this.utilities.log(`obteniendo orders sin transporte asignado...`);
          toReturn = this.httpClient.get(environment.apiBaseUrl + '/outbound/ordersToAssign/all;' +
          params).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.ORDER_LINE: {
        break;
      }
      case IMPORTING_TYPES.ORDER_TYPE: {
        toReturn = this.getAllOrderTypes();
        break;
      }
      case IMPORTING_TYPES.SECTIONS: {
        if (owner !== null) {
          httpHeaders.append('ownerId', owner.toString());
          this.utilities.log(`obteniendo sections...`);
          toReturn = this.sectionService.retrieveAllSections(owner).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.TRANSPORTS: {
        // TODO: falta owner
        this.utilities.log(`obteniendo transports...`);
        toReturn = this.getAllTransports();
        break;
      }
      case IMPORTING_TYPES.TRANSPORT_STATE: {
        this.utilities.log(`obteniendo transport states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(Transport.TransportationStatusEnum)));
        break;
      }
      case IMPORTING_TYPES.UOMS: {
        if (owner !== null) {
          httpHeaders.append('ownerId', owner.toString());
          this.utilities.log(`obteniendo uoms...`);
          toReturn = this.uomService.retrieveAllUom(owner).pipe(retry(3));
        }
        break;
      }
      case IMPORTING_TYPES.PICK_PLANNINGS: {
        this.utilities.log(`obteniendo pick plannings...`);
        toReturn = this.getAllPickPlannings('startRow=0;endRow=10');
        break;
      }
      case IMPORTING_TYPES.PICK_TASKS: {
        if (id) {
          // TODO: falta owner
          this.utilities.log(`obteniendo pick tasks de ${id}...`);
          toReturn = this.pickTaskService.taskByPickPlanning(id).pipe(retry(3));
        } else {
          if (owner !== null) {
            httpHeaders.append('owner-id', owner.toString());
            toReturn = this.httpClient.get(environment.apiBaseUrl +
              '/outbound/pick/taskList/all;' + params, {
              headers: httpHeaders
            }).pipe(retry(3));
          }
        }
        break;
      }
      case IMPORTING_TYPES.PICK_TASKLINES: {
        // TODO: falta owner
        if (id) {
          this.utilities.log(`obteniendo pick tasks lines de ${id}...`);
          toReturn = this.pickTaskService.taskLineByPickTaskId(id).pipe(retry(3));
        } else {
          this.utilities.error('received id is invalid');
        }
        break;
      }
      case IMPORTING_TYPES.DOCKS: {
        // TODO: falta owner
        this.utilities.log(`obteniendo docks...`);
        toReturn = this.getAllDocks().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.DOCKS_LIST: {
        // TODO: falta owner
        this.utilities.log(`obteniendo docks list...`);
        toReturn = this.getAllDocks().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TASK_STATE: {
        this.utilities.log(`obteniendo pick task states...`);
        toReturn = new Observable(suscriber  => suscriber.next(Object.keys(PickTask.TaskStateEnum)));
        break;
      }
      case IMPORTING_TYPES.PICK_STATE: {
        // TODO: falta owner
        this.utilities.log(`obteniendo pick planning states...`);
        toReturn = this.getAllPickPlanningStates().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.USERS: {
        // TODO: falta owner
        this.utilities.log(`obteniendo users...`);
        toReturn = this.getAllUsers().pipe(retry(3));
        break;
      }
      case IMPORTING_TYPES.TASK_TYPES: {
        // TODO: falta owner
        this.utilities.log(`obteniendo pick task types...`);
        toReturn = this.getAllTaskTypes().pipe(retry(3));
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

  public getMemberData(username: string, observe: any = 'body', reportProgress = false) {
    return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/settings/` +
    `userMember?userName=${username}`).pipe(retry(3));
  }

  getDashboardDataHeader(from?: string, to?: string) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      from = from ? from : this.utilities.formatDate(new Date(Date.now() - (365 * 24 * 60 * 60000)));
      to = to ? to : this.utilities.formatDate(new Date());
      return this.httpClient.get(`${environment.apiBaseUrl}/outbound/dashboard/header?` +
      `initialPeriod=${from}&finalPeriod=${to}`, {
        headers: new HttpHeaders().append('ownerId', owner.toString())
      });
    }
    return of([]);
  }

  getDashboardDataBody(from?: string, to?: string) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      from = from ? from : this.utilities.formatDate(new Date(Date.now() - (365 * 24 * 60 * 60000)));
      to = to ? to : this.utilities.formatDate(new Date());
      return this.httpClient.get(`${environment.apiBaseUrl}/outbound/dashboard/body?` +
      `initialPeriod=${from}&finalPeriod=${to}`, {
        headers: new HttpHeaders().append('ownerId', owner.toString())
      });
    }
    return of([]);
  }
  /**********************************************************************************
    Grupo de metodos para users
  ***********************************************************************************/
  public getAllUsers(observe: any = 'body', reportProgress = false): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/settings/user`);
    // return of([]);
  }

  public getUserData(username: string, observe: any = 'body', reportProgress = false): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/settings/userMember?userName=${username}`);
    // return of([]);
  }
  /**********************************************************************************
    Grupo de metodos para items
  ***********************************************************************************/
  public getAllItems(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false) {
    return this.httpClient.get(environment.apiBaseUrl + '/settings/itemsVo1/' + params)
    .pipe(retry(3));
  }

  public deleteItem(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemService.deleteItem(id, observe, reportProgress);
  }

  public updateItem(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.itemService.updateItem(data, id, observe, reportProgress);
  }

  public createItem(data: any, observe: any = 'body', reportProgress = false) {
    data.ownerId = this.authService.getOwnerId();
    return this.itemService.createItem(data, observe, reportProgress);
  }

  public createItems(data: any[], observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.itemService.createItemsList(data, owner, observe, reportProgress);
    }
    return of(false);
  }

  public getItem(id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.itemService.retrieveItem(id, owner, observe, reportProgress);
    }
    return of(false);
  }
  /**********************************************************************************
    Grupo de metodos para item types
  ***********************************************************************************/
  public getAllItemTypes(observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.itemTypeService.retrieveAllItemTypes(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteItemType(id: number, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.deleteItemType(id, observe, reportProgress);
  }

  public updateItemType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.itemTypeService.updateItemType(data, id, observe, reportProgress);
  }

  public createItemType(data: any, observe: any = 'body', reportProgress = false) {
    data.ownerId = this.authService.getOwnerId();
    return this.itemTypeService.createItemType(data, observe, reportProgress);
  }

  public getItemtype(id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.itemTypeService.retrieveItemTypeById(id, owner, observe, reportProgress);
    }
    return of(false);
  }
  /**********************************************************************************
    Grupo de metodos para uoms
  ***********************************************************************************/
  public getAllUoms(observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.uomService.retrieveAllUom(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.deleteUom(id, observe, reportProgress);
  }

  public updateUom(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.updateUom(data, id, observe, reportProgress);
  }

  public createUom(data: any, observe: any = 'body', reportProgress = false) {
    data.ownerId = this.authService.getOwnerId();
    return this.uomService.createUom(data, observe, reportProgress);
  }

  public getUom(id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.retrieveUomById(id, observe, reportProgress);
  }
  /*********************************************************************************
   *  Grupo de metodos para lpns
   *********************************************************************************/
  public getLpns(id: number, observe: any = 'body', reportProgress = false): Observable<any> {
    const params = 'startRow=0;endRow=10000';
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    if (owner !== null) {
      httpHeaders.append('ownerId', owner.toString());
      return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/storage/lpnItemsVO2?` +
      `lpnItemId=${id}`, {
        headers: httpHeaders
      });
    }
    return of(false);
  }

  public getAllLpns(observe: any = 'body', reportProgress = false): Observable<any[]> {
    const params = 'startRow=0;endRow=10000';
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    if (owner !== null) {
      httpHeaders.append('ownerId', owner.toString());
      return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/storage/lpnsVO1`, {
        headers: httpHeaders
      });
    }
    return of([]);
  }

  public deleteLpns(id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.deleteUom(id, observe, reportProgress);
  }

  public updateLpns(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.uomService.updateUom(data, id, observe, reportProgress);
  }

  public createLpns(data: any, observe: any = 'body', reportProgress = false) {
    return this.uomService.createUom(data, observe, reportProgress);
  }
  /*********************************************************************************
   *  Grupo de metodos para inventory
   *********************************************************************************/
  public getInventoryItem(id: number, observe: any = 'body', reportProgress = false): Observable<any> {
    return of({
      id: 7868,
      code: 'jhgj',
      type: 'kjkj',
      interface: 'jkjh',
      state: 'jkjkh',
      labelWithMaterial: true
    }).pipe(delay(1000));
   }

   public getAllInventoryItems(observe: any = 'body', reportProgress = false): Observable<any[]> {
    const params = 'startRow=0;endRow=10000';
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    if (owner !== null) {
      httpHeaders.append('ownerId', owner.toString());
      return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/storage/lpnItemsVO1/` +
      `all;startRow=0;endRow=99999999;sort-lpnItemId=asc`, {
        headers: httpHeaders
      }).pipe(retry(3), timeout(600000));
    }
    return of([]);
   }

   public deleteInventoryItem(id: number, observe: any = 'body', reportProgress = false) {
     return this.uomService.deleteUom(id, observe, reportProgress);
   }

   public updateInventoryItem(data: any, id: number, observe: any = 'body', reportProgress = false) {
     return this.uomService.updateUom(data, id, observe, reportProgress);
   }

   public createInventoryItem(data: any, observe: any = 'body', reportProgress = false) {
     return this.uomService.createUom(data, observe, reportProgress);
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

  public createItemUoms(data: any, observe: any = 'body', reportProgress = false) {
    return this.itemUomService.createItemUomList(data, observe, reportProgress);
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
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.qualityStateService.retrieveAllQualityStates(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteQualityState(id: number, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.deleteQualityState(id, observe, reportProgress);
  }

  public updateQualityState(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.updateQualityState(data, id, observe, reportProgress);
  }

  public createQualityState(data: any, observe: any = 'body', reportProgress = false) {
    return this.qualityStateService.createQualityState(data, observe, reportProgress);
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
    return this.qualityStateService.createQualityState(data, observe, reportProgress);
  }

  public getQualityStateType(observe: any = 'body', reportProgress = false) {
    return of({});
  }
  /**********************************************************************************
    Grupo de metodos para locations
  ***********************************************************************************/
  public getAllLocations(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false) {
      this.utilities.log(`obteniendo locations...`);
      return this.httpClient.get(environment.apiBaseUrl + '/settings/locationsVO1/all;' + params)
      .pipe(retry(3));
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
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.locationService.createLocationsList(data, owner, observe, reportProgress);
    }
    return of(false);
  }

  public getLocation(id: number, observe: any = 'body', reportProgress = false) {
    return this.locationService.retrieveLocation(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para sections
  ***********************************************************************************/
  public getAllSections(observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.sectionService.retrieveAllSections(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteSection(id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.deleteSection(id, observe, reportProgress);
  }

  public updateSection(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.updateSection(data, id, observe, reportProgress);
  }

  public createSection(data: any, observe: any = 'body', reportProgress = false) {
    const depo = this.authService.getDepotId();
    if (depo !== null) {
      data.depotId = depo;
    }
    return this.sectionService.createSection(data, observe, reportProgress);
  }

  public getSection(id: number, observe: any = 'body', reportProgress = false) {
    return this.sectionService.retrieveSectionById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para orders
  ***********************************************************************************/
  public getAllOrders(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false) {
    return this.httpClient.get(environment.apiBaseUrl + '/outbound/ordersVO1/all;' + params)
    .pipe(retry(3));
  }

  public deleteOrder(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.deleteOrder(id, observe, reportProgress);
  }

  public updateOrder(data: any, id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    const depot = this.authService.getDepotId();
    if (owner !== null) {
      data.ownerId = owner;
      data.depotId = depot;
    }
    return this.orderService.updateOrder(data, id, observe, reportProgress);
  }

  public updateOrdersTransport(data: any[], idTransport: number, observe: any = 'body', reportProgress = false) {
    const params = 'startRow=0;endRow=10000';
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    if (owner !== null) {
      httpHeaders.append('ownerId', owner.toString());
      return this.httpClient.post(environment.apiBaseUrl +
        '/outbound/orders/assignmentTransport?idTransport=' + idTransport, data, {
          headers: httpHeaders
        });
    }
    return of(false);
  }

  public createOrder(data: any, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    const depot = this.authService.getDepotId();
    if (owner !== null) {
      data.ownerId = owner;
      data.depotId = depot;
    }
    return this.orderService.createOrder(data, observe, reportProgress);
  }

  public createOrders(data: any[], observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    const depo = this.authService.getDepotId();
    return this.orderService.createOrderList(data, owner, depo, observe, reportProgress);
  }

  public getOrder(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderService.retrieveOrder(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para transport
  ***********************************************************************************/
  public getAllTransports(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl +
      '/outbound/transportsVO1/all;' + params).pipe(retry(3));
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
    const owner = this.authService.getOwnerId();
    const depot = this.authService.getDepotId();
    if (owner !== null) {
      data.ownerId = owner;
      data.depotId = depot;
    }
    return this.transportService.createTransport(data, observe, reportProgress);
  }

  public getTransport(id: number, observe: any = 'body', reportProgress = false) {
    return this.transportService.retrieveTransport(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para order type
  ***********************************************************************************/
  public getAllOrderTypes(observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.orderTypeService.retrieveAllOrderType(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteOrderType(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.deleteorderType(id, observe, reportProgress);
  }

  public updateOrderType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      data.ownerId = owner;
    }
    return this.orderTypeService.updateorderType(data, id, observe, reportProgress);
  }

  public createOrderType(data: any, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      data.ownerId = owner;
    }
    return this.orderTypeService.createOrderType(data, observe, reportProgress);
  }

  public getOrderType(id: number, observe: any = 'body', reportProgress = false) {
    return this.orderTypeService.retrieveorderTypeById(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para customers
  ***********************************************************************************/
  public getAllCustomers(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false) {
    return this.httpClient.get<any>(environment.apiBaseUrl + '/settings/customersVO1/all;' + params)
    .pipe(retry(3));
  }

  public deleteCustomer(id: number, observe: any = 'body', reportProgress = false) {
    return this.customerService.deleteCustomer(id, observe, reportProgress);
  }

  public updateCustomer(data: any, id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      data.ownerId = owner;
    }
    return this.customerService.updateCustomer(data, id, observe, reportProgress);
  }

  public createCustomer(data: any, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      data.ownerId = owner;
    }
    return this.customerService.createCustomer(data, observe, reportProgress);
  }

  public getCustomer(id: number, observe: any = 'body', reportProgress = false): Observable<any> {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.customerService.retrieveCustomerById(id, owner, observe, reportProgress);
    }
    return of(false);
  }
  /**********************************************************************************
    Grupo de metodos para load picks
  ***********************************************************************************/
  public createLoadPicks(data: any[], transportNumber: string, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    const depot = this.authService.userData.depotId;
    if (owner !== null && depot !== null && transportNumber) {
      return this.loadPickService.createLoadPick(data, owner, depot, transportNumber, observe, reportProgress);
    }
    return of(false);
  }
  /**********************************************************************************
    Grupo de metodos para pick planning
  ***********************************************************************************/
  public getAllPickPlannings(params = 'startRow=0;endRow=10000', observe: any = 'body', reportProgress = false) {
    // return this.pickPlanningService.retrieveAllPickPlanning(observe, reportProgress);
    return this.httpClient.get(environment.apiBaseUrl +
      '/outbound/pick/pickPlanningVO1/all;' + params).pipe(retry(3));
  }

  public getAllPickPlanningTasks(pickPlanningId: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.taskByPickPlanning(pickPlanningId, observe, reportProgress);
  }

  public getAllPickPlanningTasksVO3(pickPlanningId: number, observe: any = 'body', reportProgress = false) {
    // return this.pickTaskService.taskByPickPlanning(pickPlanningId, observe, reportProgress);
    // return this.httpClient.get<any>(`${environment.apiBaseUrl}/outbound/pick/tasksVO3?pickPlanningId=${pickPlanningId}`)
    return this.httpClient.get<any>(`${environment.apiBaseUrl}/outbound/pick/tasksVO3/` +
    `all;pickPlanningId-type=equals;pickPlanningId-filter=${pickPlanningId};pickPlanningId-filterType` +
    `=number;startRow=0;endRow=200;`);
  }

  public getAllPickPlanningStates(observe: any = 'body', reportProgress = false): Observable<string[]> {
    return new Observable(suscriber  => suscriber.next(Object.keys(PickPlanning.StateEnum)));
  }

  public getPickPlanningTransport(id: number, observe: any = 'body', reportProgress = false) {
    return this.transportService.findByPickPlanning(id, observe, reportProgress);
  }

  public deletePickPlanning(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.deletePickPlanning(id, observe, reportProgress);
  }

  public updatePickPlanning(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.pickPlanningService.updatePickPlanning(data, id, observe, reportProgress);
  }

  public createPickPlanning(data: any, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    const depot = this.authService.getDepotId();
    if (owner !== null && depot !== null) {
      data.depotId = depot;
      data.ownerId = owner;
    }
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
    const owner = this.authService.getOwnerId();
    const depot = this.authService.getDepotId();
    if (depot !== null && owner !== null) {
      return this.pickTaskService.retrievePickTaskByUsername(owner, depot, user, observe, reportProgress);
    }
    return of([]);
  }

  public getAllPickTaskLinesByTask(idTask: number, observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task lines de task: ', idTask);
    return this.pickTaskService.taskLineByPickTaskId(idTask, observe, reportProgress);
  }

  public getAllPickTaskLinesBySku(idTask: number, observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task lines de task by sku: ', idTask);
    return this.httpClient.get<any>(`${environment.apiBaseUrl}/outbound/pick/taskLineVO1?pickTaskId=${idTask}`);
  }

  public getAllPickTaskLinesByLines(idTask: number, observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task lines de task by lines: ', idTask);
    const params = 'startRow=0;endRow=10000';
    const owner = this.authService.getOwnerId();
    const httpHeaders = new HttpHeaders();
    if (owner !== null) {
      httpHeaders.append('ownerId', owner.toString());
      return this.httpClient.get<any[]>(`${environment.apiBaseUrl}/` +
      `outbound/pick/taskLineVO1/pickTaskId-type=equals;` +
      `pickTaskId-filter=${idTask};pickTaskId-filterType=number;startRow=0;endRow=1000;`, {
        headers: httpHeaders
      });
    }
    return of([]);
  }

  public getAllPickTaskTypes(observe: any = 'body', reportProgress = false): Observable<any[]> {
    console.log('obteniendo task types');
    return this.taskTypeService.retrieveAllTaskType(observe, reportProgress);
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
      '/outbound/pick/changePickTaskStatus?codeState=' + status, data);*/
      return this.pickTaskService.changePickTaskStatus(data, state, observe, reportProgress);
  }

  public assignUserToPickTask(data: any, user: any, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.assignUserPickTask(data, user.userName);
  }

  public assignUserToPickTaskList(data: any[], user: any, observe: any = 'body', reportProgress = false) {
    // return this.pickTaskService.assignUserPickTask(data, user.userName);
    return this.httpClient.put(environment.apiBaseUrl +
      '/outbound/pick/assignUserPickTask?userName=' + user.userName, data);
  }

  public getTasksByPickPlanning(id: number, observe: any = 'body', reportProgress = false) {
    return this.pickTaskService.taskByPickPlanning(id, observe, reportProgress);
  }
  /**********************************************************************************
    Grupo de metodos para docks
  ***********************************************************************************/
  public getAllDocks(observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.docksService.retrieveAllDocks(owner, observe, reportProgress);
    }
    return of([]);
  }

  public deleteDock(id: number, observe: any = 'body', reportProgress = false) {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.docksService.deleteDock(id, owner, observe, reportProgress);
    }
    return of(false);
  }

  public updateDock(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.docksService.updateDock(data, id, observe, reportProgress);
  }

  public createDock(data: any, observe: any = 'body', reportProgress = false): Observable<any> {
    const owner = this.authService.getOwnerId();
    if (owner !== null) {
      return this.docksService.createDock(data, owner, observe, reportProgress);
    }
    return of(false);
  }

  public getDock(id: number, observe: any = 'body', reportProgress = false) {
    // return this.docksService.retrieveDockById(id, owner, observe, reportProgress);
    return this.httpClient.get<any>(environment.apiBaseUrl +
      '/outbound/DockVO1/' + id).pipe(retry(3));
  }
  /**********************************************************************************
    Grupo de metodos para task types
  ***********************************************************************************/
  public getAllTaskTypes(observe: any = 'body', reportProgress = false) {
    return this.taskTypeService.retrieveAllTaskType(observe, reportProgress);
  }

  public deleteTaskType(id: number, observe: any = 'body', reportProgress = false) {
    return this.taskTypeService.deleteTaskType(id, observe, reportProgress);
  }

  public updateTaskType(data: any, id: number, observe: any = 'body', reportProgress = false) {
    return this.taskTypeService.updateTaskType(data, id, observe, reportProgress);
  }

  public createTaskType(data: any, observe: any = 'body', reportProgress = false) {
    return this.taskTypeService.createTaskType(data, observe, reportProgress);
  }

  public getTaskType(id: number, observe: any = 'body', reportProgress = false) {
    return this.taskTypeService.retrieveTaskTypeById(id, observe, reportProgress);
  }
}
