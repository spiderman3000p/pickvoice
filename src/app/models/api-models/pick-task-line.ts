import { PickTaskLine as Interface } from '@pickvoice/pickvoice-api/model/pickTaskLine';
export class PickTaskLine implements Interface {
    /**
     * Identificador unico de la linea
     */
    id?: number;
    /**
     * Identificador de la tarea de picking
     */
    idPickTask?: number;
    /**
     * La secuencia que debe seguir la tarea en cada linea
     */
    pickSequenceNumber?: number;
    /**
     * fecha de procesamiento
     */
    processDate?: string;
    /**
     * cantidad que se requiere pickear
     */
    qtyToPicked?: number;
    /**
     * cantidad tomada en el picking
     */
    qtyToSelected?: number;
    constructor() {
        this.id = 0;
        this.idPickTask = 0;
        this.pickSequenceNumber = 0;
        this.processDate = '';
        this.qtyToPicked = 0;
        this.qtyToSelected = 0;
    }
}
