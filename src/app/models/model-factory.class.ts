import {Item, UnityOfMeasure, Location, Customer, OrderLine, ItemType, OrderType, Transport,
        Section, Order, LoadPick, OrderLines, PickPlanning, PickTask, PickTaskLine, LoadOrder,
        PickTaskLines, Dock, User, Role, TaskType, LoadItem, LoadLocation, ItemUom, QualityStates,
        QualityStateType
     } from '@pickvoice/pickvoice-api';
import { IMPORTING_TYPES } from './model-maps.model';

export class ModelFactory {

    constructor() {
    }

    public static newEmptyObject(type: string) {
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
        if (type === IMPORTING_TYPES.PICK_TASKLINES) {
            return this.newEmptyTaskLine();
        }
        if (type === IMPORTING_TYPES.DOCKS) {
            return this.newEmptyDock();
        }
        if (type === IMPORTING_TYPES.QUALITY_STATES) {
            return this.newEmptyQualityState();
        }
        return null;
    }

    public static newEmptyQualityState(): QualityStates {
        const object = new Object() as QualityStates;
        object.code = '';
        object.name = '';
        object.optionalCode = '';
        object.qualityStateType = this.newEmptyQualityStateType();
        object.state = false;
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
        object.item = this.newEmptyItem();
        object.length = 0;
        object.numerator = 0;
        object.uom = this.newEmptyUnityOfMeasure();
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
        object.itemType = this.newEmptyItemType();
        object.phonetic = '';
        object.scannedVerification = '';
        object.serial = false;
        object.shelfLife = 0;
        object.spokenVerification = '';
        object.uom = this.newEmptyUnityOfMeasure();
        object.upc = '';
        object.variableWeight = false;
        object.weight = false;
        object.weightTolerance = 0;
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
        object.section = this.newEmptySection();
        object.locationState = Location.LocationStateEnum.DO;
        object.locationType = Location.LocationTypeEnum.Location;
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
        object.orderType = this.newEmptyOrderType();
        object.priority = 0;
        object.note = '';
        object.orderDate = '';
        object.transport = this.newEmptyTransport();
        object.customer = this.newEmptyCustomer();
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
        object.uomVolume = this.newEmptyUnityOfMeasure();
        object.uomWeight = this.newEmptyUnityOfMeasure();
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
        const object = new Object() as OrderLine;
        object.idOrder = null;
        object.item = {} as Item;
        object.qtyRequired = 0;
        object.batchNumber = '';
        object.createDate = '';
        object.expiryDate = '';
        object.serial = '';
        object.qualityState = '';
        return object;
    }

    public static newEmptyCustomer(): Customer {
        const object = new Object() as Customer;
        object.code = '';
        object.name = '';
        object.contact = '';
        object.phone = '';
        object.address = '';
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
        object.qyt = 0;
        object.taskState = PickTask.TaskStateEnum.AC;
        object.taskType = this.newEmptyTaskType();
        object.user = this.newEmptyUser();
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
        object.rol = this.newEmptyRole();
        object.userName = '';
        object.userState = User.UserStateEnum.Active;
        return object;
    }

    public static newEmptyRole(): Role {
        const object = new Object() as Role;
        object.code = '';
        object.name = '';
        return object;
    }

    public static newEmptyDock(): Dock {
        const object = new Object() as Dock;
        object.code = '';
        object.description = '';
        object.dockType = Dock.DockTypeEnum.Bivalent;
        object.section = this.newEmptySection();
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
        object.targetDock = this.newEmptyDock();
        return object;
    }
}
