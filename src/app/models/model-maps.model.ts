/*
    Esta clase contiene propiedades estaticas. Cada propiedad se refiere a una entidad distinta.
    Cada propiedad aqui especificada, corresponde a las columnas de los archivos de importacion
    (csv, xlsx) para cada entidad, y se especifican su nombre para usar en el header de la tabla en la
    pantalla de importacion, si son columnas requeridas, unicas, el valor minimo, el valor maximo, y el
    tipo de dato (en caso de que sea distinto a un string y necesite un input especial, como las
    fechas por ejemplo).

    Los atributos validados hasta ahora son:
    boolean: para mostrar un toggle en los formularios
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
            required: true,
            type: 'string'
        },
        upc: {
            name: 'upc',
            required: false,
            type: 'string'
        },
        description: {
            name: 'item description',
            required: true,
            type: 'string'
        },
        phonetic: {
            name: 'phonetic description',
            required: false,
            type: 'string'
        },
        itemType: {
            name: 'item type',
            required: true,
            type: 'itemType'
        },
        uom: {
            name: 'item uom',
            required: true,
            type: 'itemUom'
        },
        weightTolerance: {
            name: 'weight tolerance',
            required: true,
            min: 0,
            max: 100,
            type: 'number'
        },
        scannedVerification: {
            name: 'scanner verification id',
            required: false,
            type: 'string'
        },
        spokenVerification: {
            name: 'spoken verification id',
            required: false,
            type: 'string'
        },
        weight: {
            name: 'item weight',
            required: false,
            type: 'boolean'
        },
        variableWeight: {
            name: 'variable weight',
            required: true,
            type: 'boolean'
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'boolean'
        },
        serial: {
            name: 'item serial',
            required: false,
            type: 'boolean'
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'boolean'
        }
    };

    public static LocationMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string'
        },
        section: {
            name: 'section',
            required: false,
            type: 'string'
        },
        lane: {
            name: 'lane',
            required: false,
            type: 'string'
        },
        column: {
            name: 'column',
            required: false,
            type: 'string'
        },
        height: {
            name: 'height',
            required: false,
            type: 'number'
        },
        deep: {
            name: 'deep',
            required: false,
            type: 'string'
        },
        checkDigit: {
            name: 'check digit',
            required: false,
            unique: true,
            type: 'number',
            min: 1,
            max: 99999,
            minlength: 1,
            maxlength: 5
        },
        module: {
            name: 'module',
            required: false,
            type: 'string'
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
        /*serial: {
            name: 'serial',
            required: false
        },*/
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
    public static RecentOriginMap = {
        filename: {
            name: 'file name',
            type: 'string'
        },
        filepath: {
            name: 'file path',
            type: 'string'
        },
        date: {
            name: 'date',
            type: 'date'
        },
        user: {
            name: 'user',
            type: 'string'
        },
        totalRows: {
            name: 'total rows',
            type: 'number'
        },
        invalidRows: {
            name: 'invalid rows',
            type: 'number'
        }
    };

    constructor() {
    }
}
