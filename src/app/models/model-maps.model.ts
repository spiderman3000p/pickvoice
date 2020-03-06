export const IMPORTING_TYPES = {
    ITEMS: 'items',
    LOCATIONS: 'locations',
    ORDERS: 'ordersDto',
    ITEM_TYPE: 'itemTypes'
};
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
    /*********************************************
    *           Object's for CRUD's
    **********************************************/
    /* item object map for CRUD */
    public static ItemMap = {
        sku: {
            name: 'item sku',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        upc: {
            name: 'upc',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        description: {
            name: 'item description',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        phonetic: {
            name: 'phonetic description',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        itemType: {
            name: 'item type',
            required: true,
            type: 'itemType',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        uom: {
            name: 'item uom',
            required: true,
            type: 'itemUom',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        weightTolerance: {
            name: 'weight tolerance',
            required: true,
            min: 0,
            max: 100,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        scannedVerification: {
            name: 'scanner verification id',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        spokenVerification: {
            name: 'spoken verification id',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        weight: {
            name: 'item weight',
            required: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        },
        variableWeight: {
            name: 'variable weight',
            required: true,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        },
        serial: {
            name: 'item serial',
            required: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        }
        /*
            Aqui esta faltand itemState, per no se agrega porque no sera parte de los archivos de importacion.
            Este campo se añade por defecto al momento de importar.
            itemState: {
            name: 'item state',
            required: false,
            type: 'string',
            formControl: {
                control: 'select'
            }
        */
    };
    /* item type object map for CRUD */
    public static ItemTypeMap = {
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        }
    };
    /* locationr object map for CRUD */
    public static LocationMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        section: {
            name: 'section',
            required: false,
            type: 'section',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        lane: {
            name: 'lane',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        columnAt: {
            name: 'column',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        height: {
            name: 'height',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        deep: {
            name: 'deep',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        checkDigit: {
            name: 'check digit',
            required: false,
            unique: true,
            type: 'number',
            min: 1,
            max: 99999,
            minlength: 1,
            maxlength: 5,
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        type: {
            name: 'type',
            required: false,
            type: 'string',
            formControl: {
                control: 'select',
                type: 'normal',
                displayIndex: null,
                valueIndex: null
            }
        },
        state: {
            name: 'status',
            required: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        }
    };
    /* order object map for CRUD */
    public static OrderMap = {
        orderNumber:  {
            name: 'order number',
            required: true,
            unique: true,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        deliveryDate: {
            name: 'delivery date',
            required: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        transport: {
            name: 'transport',
            required: false,
            type: 'transport',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        customer: {
            name: 'customer',
            required: false,
            type: 'customer',
            forFile: false,
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        orderLine: {
            name: 'order line',
            required: false,
            type: 'orderLine',
            forFile: false,
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },

        route: {
            name: 'route',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        routeName: {
            name: 'route name',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        dispatchPlatforms: {
            name: 'route',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        carrierCode: {
            name: 'route',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerNumber: {
            name: 'customer number',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'customer name',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        address: {
            name: 'address',
            required: false
        },
        sku: {
            name: 'sku',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        itemType: {
            name: 'item type',
            required: false,
            type: 'itemType',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        codeUom: {
            name: 'uom',
            required: false,
            type: 'string',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'name'
            }
        },
        qtyToPicked: {
            name: 'qty picked',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        /*serial: {
            name: 'serial',
            required: false
        },*/
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        codeLocation: {
            name: 'code location',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        baseItemOverride: {
            name: 'base item override',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        caseLabelCheckDigits: {
            name: 'check digits',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        cartonCode: {
            name: 'carton code',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        pickSequenceNumber: {
            name: 'pick sequence',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        /*workCode: {
            name: 'work code',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },*/
        goalTime: {
            name: 'goal time',
            required: false,
            type: 'nomber',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        departureDateTime: {
            name: 'departure date',
            required: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        rootWorkCode: {
            name: 'root code',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        }
    };
    /* recent origin object map for CRUD */
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
        rejectedRows: {
            name: 'rejected rows',
            type: 'number'
        },
        importedRows: {
            name: 'imported rows',
            type: 'number'
        }
    };

    /*********************************************
    *                   DTO's
    **********************************************/

    /* order dto map (for importing proccess) */
    public static OrderDtoMap = {
        orderNumber:  {
            name: 'order number',
            required: true,
            unique: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        purchaseNumber:  {
            name: 'purchase number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        incoiceNumber:  {
            name: 'invoice number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        orderDate:  {
            name: 'order date',
            required: true,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        deliveryDate:  {
            name: 'delivery date',
            required: true,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        customerNumber:  {
            name: 'customer number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerName:  {
            name: 'customer name',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerAddress:  {
            name: 'customer address',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        orderType:  {
            name: 'order type',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        priority:  {
            name: 'priority',
            required: true,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        note:  {
            name: 'note',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        sku:  {
            name: 'sku',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        qtyRequired:  {
            name: 'qty required',
            required: true,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        uomCode:  {
            name: 'uom code',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        batchNumber:  {
            name: 'batch number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        createDate:  {
            name: 'create date',
            required: true,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        expirateDate:  {
            name: 'expirate date',
            required: true,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        serial:  {
            name: 'serial',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        qualityState:  {
            name: 'quality state',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        }
    };

    constructor() {
    }
}
