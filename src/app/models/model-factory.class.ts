import {
    Item, UnityOfMeasure, Location, Customer, OrderLine, ItemType, OrderType, Transport,
    Section, Order, LoadPick, OrderLines, PickPlanning, PickTask, PickTaskLine, LoadOrder,
    PickTaskLines, Dock, User, /*Role,*/ TaskType, LoadItem, LoadLocation, ItemUom, QualityStates,
    QualityStateType, Lpn, Plant, Owner, Depot, Store, LpnInterval
} from '@pickvoice/pickvoice-api';
import { IMPORTING_TYPES } from './model-maps.model';

export class ModelFactory {

    constructor() {
    }

    public static newEmptyObject(type: string) {
        if (type === IMPORTING_TYPES.STORES) {
            return this.newEmptyStore();
        }
        if (type === IMPORTING_TYPES.PLANTS) {
            return this.newEmptyPlant();
        }
        if (type === IMPORTING_TYPES.DEPOTS) {
            return this.newEmptyDepot();
        }
        if (type === IMPORTING_TYPES.OWNERS) {
            return this.newEmptyOwner();
        }
        if (type === IMPORTING_TYPES.ITEMS) {
            return this.newEmptyItem();
        }
        if (type === IMPORTING_TYPES.LOCATIONS) {
            return this.newEmptyLocation();
        }
        if (type === IMPORTING_TYPES.ORDERS) {
            return this.newEmptyOrder();
        }
        if (type === IMPORTING_TYPES.ITEM_TYPE) {
            return this.newEmptyItemType();
        }
        if (type === IMPORTING_TYPES.ITEMUOMS) {
            return this.newEmptyItemUom();
        }
        if (type === IMPORTING_TYPES.UOMS) {
            return this.newEmptyUnityOfMeasure();
        }
        if (type === IMPORTING_TYPES.CUSTOMERS) {
            return this.newEmptyCustomer();
        }
        if (type === IMPORTING_TYPES.ORDER_TYPE) {
            return this.newEmptyOrderType();
        }
        if (type === IMPORTING_TYPES.ORDER_LINE) {
            return this.newEmptyOrderLine();
        }
        if (type === IMPORTING_TYPES.SECTIONS) {
            return this.newEmptySection();
        }
        if (type === IMPORTING_TYPES.TRANSPORTS) {
            return this.newEmptyTransport();
        }
        if (type === IMPORTING_TYPES.PICK_PLANNINGS) {
            return this.newEmptyPickPlanning();
        }
        if (type === IMPORTING_TYPES.PICK_TASKS) {
            return this.newEmptyTask();
        }
        if (type === IMPORTING_TYPES.TASK_TYPES) {
            return this.newEmptyTaskType();
        }
        if (type === IMPORTING_TYPES.PICK_TASKLINES) {
            return this.newEmptyTaskLine();
        }
        if (type === IMPORTING_TYPES.DOCKS) {
            return this.newEmptyDock();
        }
        if (type === IMPORTING_TYPES.QUALITY_STATES) {
            return this.newEmptyQualityState();
        }
        if (type === IMPORTING_TYPES.LPN) {
            return this.newEmptyLpn();
        }
        if (type === IMPORTING_TYPES.LPN_INTERVAL) {
            return this.newEmptyLpnInterval();
        }
        return null;
    }

    public static newEmptyStore(): Store {
        const object = new Object() as Store;
        object.code = '';
        object.name = '';
        object.address = '';
        object.cityId = 0;
        object.contact = '';
        object.email = '';
        object.phone1 = '';
        object.phone2 = '';
        object.customerId = 0;
        object.ean13  = '';
        return object;
    }

    public static newEmptyPlant(): Plant {
        const object = new Object() as Plant;
        object.code = '';
        object.name = '';
        object.address = '';
        object.cityId = 0;
        object.contact = '';
        object.email = '';
        object.phone1 = '';
        object.phone2 = '';
        return object;
    }

    public static newEmptyDepot(): Depot {
        const object = new Object() as Depot;
        object.code = '';
        object.name = '';
        object.plantId = 0;
        return object;
    }

    public static newEmptyOwner(): Owner {
        const object = new Object() as Owner;
        object.code = '';
        object.name = '';
        object.address = '';
        object.cityId = 0;
        object.contact = '';
        object.email = '';
        object.phone1 = '';
        object.phone2 = '';
        object.ean13 = '';
        object.pcl = '';
        return object;
    }

    public static newEmptyQualityState(): QualityStates {
        const object = new Object() as QualityStates;
        object.code = '';
        object.name = '';
        object.optionalCode = '';
        object.qualityStateTypeId = 0;
        object.state = false;
        object.qualityStateTypeId = 0;
        return object;
    }

    public static newEmptyLpn(): Lpn {
        const object = new Object() as Lpn;
        object.activationDate = '';
        object.closingDate = '';
        object.code = '';
        object.locationId = 0;
        object.lpnInterface = Lpn.LpnInterfaceEnum.CI;
        object.lpnState = Lpn.LpnStateEnum.IT;
        object.lpnType = Lpn.LpnTypeEnum.Carton;
        object.openingDate = '';
        return object;
    }

    public static newEmptyLpnInterval(): LpnInterval {
        const object = new Object() as LpnInterval;
        object.currentInterval = 0;
        object.fromToNumber = 0;
        object.id = 0;
        object.labelTemplateId = 0;
        object.prefijo = '';
        object.state = true;
        object.upToNumber = 0;
        return object;
    }

    public static newEmptyQualityStateType(): QualityStateType {
        const object = new Object() as QualityStateType;
        object.code = '';
        object.name = '';
        return object;
    }

    public static newEmptyItemUom(): ItemUom {
        const object = new Object() as ItemUom;
        object.denominator = 0;
        object.eanCode = '';
        object.factor = 0;
        object.height = 0;
        object.itemId = 0;
        object.dimensionUomId = 0;
        object.volumenUomId = 0;
        object.unitsPallet = 0;
        object.length = 0;
        object.numerator = 0;
        object.uomId = 0;
        object.width = 0;
        return object;
    }

    public static newEmptyItem(): Item {
        const object = new Object() as Item;
        object.sku = '';
        object.batchNumber = false;
        object.classification = Item.ClassificationEnum.A;
        object.cost = 0;
        object.description = '';
        object.expiryDate = false;
        object.itemTypeId = 0;
        object.phonetic = '';
        object.scannedVerification = '';
        object.serial = false;
        object.shelfLife = 0;
        object.spokenVerification = '';
        object.uomHandlingId = 0;
        object.uomInboundId = 0;
        object.uomOutboundId = 0;
        object.uomPackingId = 0;
        object.upc = '';
        object.qualityStateId = 0;
        object.variableWeight = false;
        object.weight = false;
        object.weightTolerance = 0;
        object.tolerance = 0;
        object.state = Item.StateEnum.Active;
        return object;
    }

    public static newEmptyLoadItem(): LoadItem {
        const object = new Object() as LoadItem;
        object.batchNumber = false;
        object.classification = Item.ClassificationEnum.A;
        object.cost = 0;
        object.description = '';
        object.itemTypeCode = '';
        object.expiryDate = false;
        object.phonetic = '';
        object.scannedVerification = '';
        object.serial = false;
        object.shelfLife = 0;
        object.spokenVerification = '';
        object.upc = '';
        object.variableWeight = false;
        object.weight = false;
        object.weightTolerance = 0;
        object.qualityStatesCode = '';
        object.sku = '';
        object.state = LoadItem.StateEnum.Active;
        object.tolerance = 0;
        object.uomCode = '';
        return object;
    }

    public static newEmptyLocation(): Location {
        const object = new Object() as Location;
        object.allowedLpns = 0;
        object.checkDigit = 0;
        object.code = '';
        object.columnAt = '';
        object.depth = '';
        object.depthSize = 0;
        object.description = '';
        object.height = '';
        object.heightSize = 0;
        object.lane = '';
        object.sectionId = 0;
        object.locationState = Location.LocationStateEnum.DO;
        object.locationType = Location.LocationTypeEnum.Dock;
        object.multireference = false;
        object.operationType = Location.OperationTypeEnum.Picking;
        object.pickHeight = false;
        object.rackType = Location.RackTypeEnum.CV;
        object.widthSize = 0;
        return object;
    }

    public static newEmptyLoadLocation(): LoadLocation {
        const object = new Object() as LoadLocation;
        object.allowedLpns = 0;
        object.code = '';
        object.columnAt = '';
        object.depth = '';
        object.depthSize = 0;
        object.description = '';
        object.height = '';
        object.heightSize = 0;
        object.lane = '';
        object.sectionCode = '';
        object.locationState = Location.LocationStateEnum.DO;
        object.locationType = Location.LocationTypeEnum.Location;
        object.multireference = false;
        object.operationType = Location.OperationTypeEnum.Picking;
        object.pickHeight = false;
        object.rackType = Location.RackTypeEnum.CV;
        object.widthSize = 0;
        return object;
    }

    public static newEmptyOrderDto() {
        const object = new Object() as LoadOrder;
        object.batchNumber = '';
        object.createDate = '';
        object.customerAddress = '';
        object.customerName = '';
        object.customerNumber = '';
        object.deliveryDate = '';
        object.expirateDate = '';
        object.invoiceNumber = '';
        object.note = '';
        object.orderDate = '';
        object.orderNumber = '';
        object.orderType = '';
        object.priority = 0;
        object.purchaseNumber = '';
        object.qtyRequired = 0;
        object.qualityState = '';
        object.serial = '';
        object.sku = '';
        object.uomCode = '';
        return object;
    }

    public static newEmptyOrder(): Order {
        const object = new Object() as Order;
        object.orderNumber = '';
        object.purchaseNumber = '';
        object.invoiceNumber = '';
        object.orderDate = '';
        object.deliveryDate = '';
        object.orderTypeId = 0;
        object.priority = 0;
        object.note = '';
        object.orderDate = '';
        object.transportId = 0;
        object.customerId = 0;
        object.orderLines = [] as OrderLines;
        return object;
    }

    public static newEmptyTransport(): Transport {
        const object = new Object() as Transport;
        object.transportNumber = '';
        object.route = '';
        object.nameRoute = '';
        object.carrierCode = '';
        object.transportationStatus = Transport.TransportationStatusEnum.Checkin;
        object.actualCheckin = '';
        object.actualEndLoading = '';
        object.containerNumber = '';
        object.currentShipmentCompletion = '';
        object.currentStartLoading = '';
        object.description = '';
        object.plannedCheckin = '';
        object.plannedEndLoading = '';
        object.plannedShipmentCompletion = '';
        object.plannedStartLoading = '';
        object.shipmentDate = '';
        object.trailer = '';
        object.uomVolumeId = 0;
        object.uomWeightId = 0;
        object.vehicle = '';
        object.weight = 0;
        return object;
    }

    public static newEmptyOrderType(): OrderType {
        const object = new Object() as OrderType;
        object.code = '';
        object.description = '';
        return object;
    }

    public static newEmptySection(): Section {
        const object = new Object() as Section;
        object.code = '';
        object.name = '';
        object.description = '';
        return object;
    }

    public static newEmptyItemType(): ItemType {
        const object = new Object() as ItemType;
        object.code = '';
        object.name = '';
        object.description = '';
        return object;
    }

    public static newEmptyUnityOfMeasure(): UnityOfMeasure {
        const object = new Object() as UnityOfMeasure;
        object.code = '';
        object.name = '';
        return object;
    }

    public static newEmptyOrderLine(): OrderLine {
        const date = new Date();
        const object = new Object() as any;
        let month = (date.getMonth() + 1).toString();
        let day  = date.getDate().toString();
        month = month.length === 1 ? '0' + month : month;
        day = day.length === 1 ? '0' + day : day;
        object.idOrder = null;
        // object.id = Date.now();
        object.itemId = 0;
        object.qtyRequired = 0;
        object.batchNumber = '';
        object.createDate = `${date.getFullYear()}-${month}-${day}`;
        object.expiryDate = '';
        object.serial = '';
        object.qualityState = '';
        object.reference = '';
        return object;
    }

    public static newEmptyCustomer(): Customer {
        const object = new Object() as Customer;
        object.code = '';
        object.name = '';
        object.contact = '';
        object.phone = '';
        object.address = '';
        object.gln = '';
        object.postalCode = '';
        object.longitude = '';
        object.latitude = '';
        object.zone = '';
        object.neighborhood = '';
        object.cityId = 0;
        return object;
    }

    public static newEmptyLoadPickDto(): LoadPick {
        const object = new Object() as LoadPick;
        object.baseItemOverride = false;
        object.batchNumber = '';
        object.carrierCode = '';
        object.cartonCode = '';
        object.caseLabelCheckDigits = false;
        object.customerAddress = '';
        object.customerName = '';
        object.customerNumber = '';
        object.deliveryDate = '';
        object.departureDateTime = '';
        object.dispatchPlatforms = '';
        object.expiryDate = '';
        object.goalTime = 0;
        object.orderNumber = '';
        object.pickSequenceNumber = 0;
        object.qtyToPicked = 0;
        object.route = '';
        object.serial = '';
        object.sku = '';
        object.skuDescription = '';
        object.transportNumber = '';
        object.workType = LoadPick.WorkTypeEnum[0];
        object.orderTypeCode = '';
        object.itemTypeCode = '';
        object.uomCode = '';
        object.createDate = '';
        object.qualityState = '';
        object.locationCode = '';
        object.childrenWork = '';
        object.rootWork = '';
        return object;
    }

    public static newEmptyTask(): PickTask {
        const object = new Object() as PickTask;
        object.description = '';
        object.childrenWork = '';
        object.currentLine = 0;
        object.date = '';
        object.dateAssignment = '';
        object.document = '';
        object.enableDate = '';
        object.id = 0;
        object.lines = 0;
        object.priority = 0;
        object.qty = 0;
        object.taskState = PickTask.TaskStateEnum.AC;
        object.taskTypeId = 0;
        object.userId = 0;
        return object;
    }

    public static newEmptyTaskLine(): PickTaskLine {
        const object = new Object() as PickTaskLine;
        object.batchNumber = '';
        object.expiryDate = '';
        object.locationCheckDigit = 0;
        object.locationCode = '';
        object.locationId = '';
        object.lpnCode = '';
        object.lpnId = 0;
        object.lpnItemId = 0;
        object.lpnItemId = 0;
        object.pickSequenceNumber = 0;
        object.pickTaskLineId = 0;
        object.qtyToPicked = 0;
        object.scannedVerification = '';
        object.sectionCode = '';
        object.serial = '';
        object.sku = '';
        object.skuDescription = '';
        object.spokenVerification = '';
        object.uomCode = '';
        object.uomId = 0;
        return object;
    }

    public static newEmptyTaskType(): TaskType {
        const object = new Object() as TaskType;
        object.code = '';
        object.description = '';
        object.id = 0;
        object.name = '';
        return object;
    }

    public static newEmptyUser(): User {
        const object = new Object() as User;
        object.email = '';
        object.firstName = '';
        object.lastName = '';
        object.password = '';
        object.passwordConfirm = '';
        object.phone = '';
        // object.rolId = this.newEmptyRole();
        object.userName = '';
        // object.userState = User.UserStateEnum.Active;
        return object;
    }

    /*public static newEmptyRole(): Role {
        const object = new Object() as Role;
        object.code = '';
        object.name = '';
        return object;
    }*/

    public static newEmptyDock(): Dock {
        const object = new Object() as Dock;
        object.code = '';
        object.description = '';
        object.dockType = Dock.DockTypeEnum.Bivalent;
        object.sectionId = 0;
        object.locationState = Dock.LocationStateEnum.A;
        object.locationType = Dock.LocationTypeEnum.Dock;
        return object;
    }

    public static newEmptyPickPlanning(): PickPlanning {
        const object = new Object() as PickPlanning;
        object.description = '';
        object.processDate = '';
        object.progress = 0;
        object.rootWork = '';
        object.state = PickPlanning.StateEnum.CA;
        object.targetDockId = 0;
        return object;
    }
}
