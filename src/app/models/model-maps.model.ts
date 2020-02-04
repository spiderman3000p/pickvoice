import { Item } from './item';
export class ModelMap {
    public static ItemMap = {
        sku: {
            name: 'item sku',
            required: true
        },
        upc: {
            name: 'upc',
            required: false
        },
        description: {
            name: 'item description',
            required: true
        },
        phonetic: {
            name: 'phonetic description',
            required: false
        },
        itemType: {
            name: 'item type',
            required: true
        },
        uom: {
            name: 'item uom',
            required: true
        },
        weight: {
            name: 'item weight',
            required: false
        },
        variableWeight: {
            name: 'variable weight',
            required: true,
            min: 0,
            max: 100
        },
        weightTolerance: {
            name: 'weight tolerance',
            required: true
        },
        expiryDate: {
            name: 'expiry date',
            required: false
        },
        serial: {
            name: 'item serial',
            required: false
        },
        batchNumber: {
            name: 'batch number',
            required: false
        },
        scannerVerification: {
            name: 'scanner verification id',
            required: false
        },
        spokenVerification: {
            name: 'spoken verification id',
            required: false
        },
        status: {
            name: 'Item Status',
            required: true
        }
    };

    public static LocationMap = {
        code: {
            name: 'code',
            required: true
        },
        sections: {
            name: 'sections',
            required: false
        },
        lane: {
            name: 'lane',
            required: false
        },
        column: {
            name: 'column',
            required: false
        },
        height: {
            name: 'height',
            required: false
        },
        deep: {
            name: 'deep',
            required: false
        },
        checkDigits: {
            name: 'check digits',
            required: false
        }
    };

    public static OrderMap = {
        orderNumber:  {
            name: 'order number',
            required: true,
            unique: true
        },
        deliveryDate: {
            name: 'delivery date',
            required: false
        },
        route: {
            name: 'route',
            required: true
        },
        customer: {
            name: 'customer',
            required: true
        },
        orderLine: {
            name: 'order line',
            required: true
        },
        goalTime: {
            name: 'goal time',
            required: false
        },
        departureDateTime: {
            name: 'departure date',
            required: false
        },
        rootWorkCode: {
            name: 'root code',
            required: false
        }
    };

    constructor() {
    }
}
