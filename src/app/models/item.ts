/**
 * Pick Voice
 * Api para el sistema Pick Voice, plataforma que optimiza los procesos logisticos de un centro de
 *  distribucion, implementando tecnologia por voz.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: gabriel.martinez@tau-tech.co
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ItemType } from './itemType';
import { UnityOfMeasure } from './unityOfMeasure';

export interface Item {
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
     * Este es un porcentaje. Cuando el operador informa de un peso variable, el sistema
     * comprueba que el peso reportado está dentro de x por ciento del peso del ítem.
     */
    weightTolerance?: number;
    expiryDate: boolean;
    serial: boolean;
    batchNumber: boolean;
    /**
     * El valor que debe ser escaneado para confirmar el operador está pickeando el ítem adecuado
     * en el slot correspondiente.
     */
    scannedVerification?: string;
    /**
     * El valor que debe ser hablado para confirmar que el operador está pickeando el ítem adecuado
     * en el slot correspondiente.
     */
    spokenVerification?: string;
    /**
     * Status del artículo en el propietario
     */
    itemState?: Item.ItemStateEnum;
}

export declare namespace Item {
    type ItemStateEnum = 'active' | 'locked';
    const ItemStateEnum: {
        Active: ItemStateEnum;
        Locked: ItemStateEnum;
    };
}