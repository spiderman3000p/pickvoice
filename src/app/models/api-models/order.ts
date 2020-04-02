import { Order as Interface } from '@pickvoice/pickvoice-api/model/order';
import { OrderType } from './order-type';
import { Customer } from './customer';
import { OrderLine } from './order-line';
export class Order implements Interface {
    /**
     * Identificador único para una orden o pedido.
     */
    orderNumber: string;
    /**
     * Numero de orden de compra del pedido
     */
    purchaseNumber?: string;
    /**
     * Numero de factura
     */
    invoiceNumber?: string;
    /**
     * El formato debe ser DD/MM/YYYY
     */
    orderDate?: string;
    /**
     * El formato debe ser DD/MM/YYYY
     */
    deliveryDate?: string;
    orderType?: OrderType;
    /**
     * prioridad de la orden a nivel de alistamiento
     */
    priority?: number;
    /**
     * anotacion especifica sobre el pedido
     */
    note?: string;
    /**
     * Hace referencia al Id del transporte al cual pertenece la orden
     */
    idTransport?: number;
    customer?: Customer;
    orderLines?: OrderLine[];
    constructor() {
        this.customer = new Customer();
        this.deliveryDate = '';
        this.idTransport = 0;
        this.invoiceNumber = '';
        this.note = '';
        this.orderDate = '';
        this.orderLines = [];
        this.orderNumber = '';
        this.orderType = new OrderType();
        this.priority = 0;
        this.purchaseNumber = '';
    }
}
