import { Item as Interface } from '@pickvoice/pickvoice-api/model/item';
import { UnityOfMeasure } from './unity-of-measure';
import { ItemType } from './item-type';

export class Item implements Interface {
    sku: string;
    upc?: string;
    description: string;
    phonetic?: string;
    itemType: ItemType;
    uom: UnityOfMeasure;
    weight?: boolean;
    /**
     * Bandera que identifica un ítem como artículo de peso variable.
     */
    variableWeight?: boolean;
    /**
     * Este es un porcentaje. Cuando el operador informa de un peso variable,
     * el sistema comprueba que el peso reportado está dentro de x por ciento del peso del ítem.
     */
    weightTolerance?: number;
    expiryDate: boolean;
    serial: boolean;
    batchNumber: boolean;
    /**
     * El valor que debe ser escaneado para confirmar el operador está pickeando el ítem adecuado en el slot correspondiente.
     */
    scannedVerification?: string;
    /**
     * El valor que debe ser hablado para confirmar que el operador está pickeando el ítem adecuado en el slot correspondiente.
     */
    spokenVerification?: string;
    /**
     * Status del artículo en el propietario
     */
    itemState?: Interface.ItemStateEnum;

    constructor() {
        this.batchNumber = false;
        this.description = '';
        this.expiryDate = false;
        this.itemState = Interface.ItemStateEnum.Active;
        this.itemType = new ItemType();
        this.phonetic = '';
        this.scannedVerification = '';
        this.serial = false;
        this.sku = '';
        this.spokenVerification = '';
        this.uom = new UnityOfMeasure();
        this.upc = '';
        this.variableWeight = false;
        this.weight = false;
        this.weightTolerance = 0;
    }
}
