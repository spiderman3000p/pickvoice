import { Location as Interface } from '@pickvoice/pickvoice-api/model/location';
import { Section } from './section';

export class Location implements Interface {
    /**
     * codigo de la ubicacion
     */
    code: string;
    section?: Section;
    /**
     * pasillo a la cual pertenece la ubicacion
     */
    lane?: string;
    /**
     * columna del rack
     */
    columnAt?: string;
    /**
     * altura de la ubicacion la cual es dependiente del nivel del rack
     */
    height?: string;
    /**
     * profundidad
     */
    deep?: string;
    /**
     * codigo de seguridad de la
     */
    checkDigit?: number;
    /**
     * estado de la ubicacion True (Activa) - false (Inactiva)
     */
    state?: boolean;
    /**
     * descripcion de la ubicacion
     */
    description?: string;
    /**
     * Tipo de ubicacion
     */
    type?: Interface.TypeEnum;
    constructor() {
        this.checkDigit = 0;
        this.code = '';
        this.columnAt = '';
        this.deep = '';
        this.description = '';
        this.height = '';
        this.lane = '';
        this.section = new Section();
        this.state = false;
        this.type = Interface.TypeEnum.Picking;
    }
}
