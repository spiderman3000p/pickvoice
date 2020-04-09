import {Item, UnityOfMeasure, Location, Customer, OrderLine, ItemType, OrderType, OrderDto, Transport,
        Section, Order, LoadPick, OrderLines, PickPlanning, PickTask, PickTaskLine,
        PickTaskLines, Dock, User, Role, TaskType
     } from '@pickvoice/pickvoice-api';

export class ModelFactory {

    constructor() {
    }

    public static newEmptyItem(): Item {
        const object = new Object() as Item;
        object.sku = '';
        object.batchNumber = false;
        object.description = '';
        object.expiryDate = false;
        object.itemState = Item.ItemStateEnum.Active;
        object.itemType = this.newEmptyItemType();
        object.phonetic = '';
        object.scannedVerification = '';
        object.serial = false;
        object.spokenVerification = '';
        object.uom = this.newEmptyUnityOfMeasure();
        object.upc = '';
        object.variableWeight = false;
        object.weight = false;
        object.weightTolerance = 0;
        return object;
    }

    public static newEmptyLocation(): Location {
        const object = new Object() as Location;
        object.checkDigit = 0;
        object.code = '';
        object.columnAt = '';
        object.deep = '';
        object.description = '';
        object.height = '';
        object.lane = '';
        object.section = this.newEmptySection();
        object.state = false;
        object.type = Location.TypeEnum.Picking;
        return object;
    }

    public static newEmptyOrderDto() {
        const object = new Object() as OrderDto;
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
        object.idTransport = null;
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
        object.transportState = Transport.TransportStateEnum.Pending;
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
        // object.palletComple = false;
        object.priority = 0;
        object.qyt = 0;
        // object.ruleExecuted = '';
        object.taskState = PickTask.TaskStateEnum.AC;
        object.taskType = this.newEmptyTaskType();
        object.user = this.newEmptyUser();
        // object.validateLocation = false;
        // object.validateLpn = false;
        // object.validateSku = false;
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
        object.status = false;
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
