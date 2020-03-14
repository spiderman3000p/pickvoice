import {Item, UnityOfMeasure, Location, Customer, OrderLine, ItemType, OrderType, OrderDto, Transport,
        Section, Order } from '@pickvoice/pickvoice-api';

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
        object.transport = this.newEmptyTransport();
        object.customer = this.newEmptyCustomer();
        object.orderLineList = [] as OrderLine[];
        return object;
    }

    public static newEmptyTransport(): Transport {
        const object = new Object() as Transport;
        object.transportNumber = '';
        object.route = '';
        object.nameRoute = '';
        object.dispatchPlatforms = '';
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
        object.order = {} as Order;
        object.item = this.newEmptyItem();
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
        object.customerNumber = '';
        object.name = '';
        object.contact = '';
        object.phone = '';
        object.address = '';
        return object;
    }
}
