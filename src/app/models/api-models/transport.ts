import { Transport as Interface } from '@pickvoice/pickvoice-api/model/transport';
import { Order } from './order';
export class Transport implements Interface {
    /**
     * Numero del transprote del tms (SAP).
     */
    transportNumber?: string;
    /**
     * Ruta a la cual pertenece en el transporte; una ruta puede tener consolidado varios transportes.
     */
    route?: string;
    nameRoute?: string;
    /**
     * Refiere a la puerta por donde se despachar el transporte.
     */
    dispatchPlatforms?: string;
    /**
     * Codigo del tranportador
     */
    carrierCode?: string;
    /**
     * Status del transporte
     */
    transportState?: Interface.TransportStateEnum;
    /**
     * Numero del contenedor donde se despacha la mercancia
     */
    containerNumber?: string;
    orders?: Order[];
    constructor() {
        this.carrierCode = '';
        this.containerNumber = '';
        this.nameRoute = '';
        this.orders = [];
        this.route = '';
        this.transportNumber = '';
        this.transportState = Interface.TransportStateEnum.Pending;
    }
}
