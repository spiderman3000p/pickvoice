/*
    Esta clase contiene propiedades estaticas. Cada propiedad se refiere a una entidad distinta.
    Cada propiedad aqui especificada, corresponde a las columnas de los archivos de importacion
    (csv, xlsx) para cada entidad, y se especifican su nombre para usar en el header de la tabla en la
    pantalla de importacion, si son columnas requeridas, unicas, el valor minimo, el valor maximo, y el
    tipo de dato (en caso de que sea distinto a un string y necesite un input especial, como las
    fechas por ejemplo).

    Los atributos validados hasta ahora son:
    required: la columna no puede estar vacia
    unique: el valor no puede repetirse en el mismo archivo,
    min: valor minimo aceptado,
    max: valor maximo aceptado,
    type: tipo de dato (solo para fechas con el valor 'date' por cuestiones de formato especial distinto
    a los campos de texto)
*/
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
            required: false,
            unique: true
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
            required: false,
            type: 'date'
        },
        transport: {
            name: 'transport',
            required: false
        },
        route: {
            name: 'route',
            required: false
        },
        routeName: {
            name: 'route name',
            required: false
        },
        dispatchPlatforms: {
            name: 'route',
            required: false
        },
        carrierCode: {
            name: 'route',
            required: false
        },
        customerNumber: {
            name: 'customer number',
            required: true
        },
        customerName: {
            name: 'customer name',
            required: true
        },
        address: {
            name: 'address',
            required: false
        },
        sku: {
            name: 'sku',
            required: false
        },
        description: {
            name: 'description',
            required: false
        },
        itemType: {
            name: 'item type',
            required: false
        },
        codeUom: {
            name: 'uom',
            required: false
        },
        qtyToPicked: {
            name: 'qty picked',
            required: false
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'date'
        },
        serial: {
            name: 'serial',
            required: false
        },
        batchNumber: {
            name: 'batch number',
            required: false
        },
        codeLocation: {
            name: 'code location',
            required: false
        },
        baseItemOverride: {
            name: 'base item override',
            required: false
        },
        caseLabelCheckDigits: {
            name: 'check digits',
            required: false
        },
        cartonCode: {
            name: 'carton code',
            required: false
        },
        pickSequenceNumber: {
            name: 'pick sequence',
            required: false
        },
        workCode: {
            name: 'work code',
            required: false
        },
        goalTime: {
            name: 'goal time',
            required: false
        },
        departureDateTime: {
            name: 'departure date',
            required: false,
            type: 'date'
        },
        rootWorkCode: {
            name: 'root code',
            required: false
        }
    };

    constructor() {
    }
}
