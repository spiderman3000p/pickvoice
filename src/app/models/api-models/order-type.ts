import { OrderType as Interface } from '@pickvoice/pickvoice-api/model/orderType';
export class OrderType implements OrderType {
    /**
     * codigo del tipo de orden
     */
    code: string;
    /**
     * descripcion corta del tipo de salida o de orden
     */
    description?: string;
    constructor() {
        this.code = '';
        this.description = '';
    }
}
