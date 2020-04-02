import { OrderLine as Interface } from '@pickvoice/pickvoice-api/model/orderLine';
import { Item } from './item';
export class OrderLine implements Interface {
    idOrder?: number;
    item?: Item;
    /**
     * Cantidad requeria en la orden
     */
    qtyRequired?: number;
    batchNumber?: string;
    createDate?: string;
    expiryDate?: string;
    serial?: string;
    qualityState?: string;
    constructor() {
        this.batchNumber = '';
        this.createDate = '';
        this.expiryDate = '';
        this.idOrder = 0;
        this.item = new Item();
        this.qtyRequired = 0;
        this.qualityState = '';
        this.serial = '';
    }
}
