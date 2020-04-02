import { Customer as Interface } from '@pickvoice/pickvoice-api/model/customer';
export class Customer implements Interface {
    /**
     * Codigo de identificacion del cliente
     */
    code?: string;
    /**
     * Nombre del cliente
     */
    name?: string;
    /**
     * Contacto del cliente
     */
    contact?: string;
    /**
     * Telefono del cliente
     */
    phone?: string;
    /**
     * Direccion del cliente
     */
    address?: string;

    constructor() {
        this.address = '';
        this.code = '';
        this.contact = '';
        this.name = '';
        this.phone = '';
    }
}
