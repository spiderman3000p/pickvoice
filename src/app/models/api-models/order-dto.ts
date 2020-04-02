import { OrderDto as Interface } from '@pickvoice/pickvoice-api/model/orderDto';
export class OrderDto implements Interface {
    orderNumber?: string;
    purchaseNumber?: string;
    invoiceNumber?: string;
    orderDate?: string;
    deliveryDate?: string;
    customerNumber?: string;
    customerName?: string;
    customerAddress?: string;
    orderType?: string;
    priority?: number;
    note?: string;
    sku?: string;
    qtyRequired?: number;
    uomCode?: string;
    batchNumber?: string;
    createDate?: string;
    expirateDate?: string;
    serial?: string;
    qualityState?: string;
    constructor() {
        this.batchNumber = '';
        this.createDate = '';
        this.customerAddress = '';
        this.customerName = '';
        this.customerNumber = '';
        this.deliveryDate = '';
        this.expirateDate = '';
        this.invoiceNumber = '';
        this.note = '';
        this.orderDate = '';
        this.orderNumber = '';
        this.orderType = '';
        this.priority = 0;
        this.purchaseNumber = '';
        this.qtyRequired = 0;
        this.qualityState = '';
        this.serial = '';
        this.sku = '';
        this.uomCode = '';
    }
}
