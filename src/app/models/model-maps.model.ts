export const IMPORTING_TYPES = {
    ITEMS: 'items',
    LOCATIONS: 'locations',
    ORDERS: 'orders',
    ORDER_LINE: 'orderLine',
    ORDERS_DTO: 'ordersDto',
    ITEM_TYPE: 'itemTypes',
    UOMS: 'uoms',
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
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
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
    /* unity of measure object map for CRUD */
    public static UomMap = {
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
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        purchaseNumber:  {
            name: 'purchase number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        invoiceNumber:  {
            name: 'invoice number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        orderDate: {
            name: 'order date',
            required: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
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
        orderType: {
            name: 'type',
            required: false,
            type: 'orderType',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'code',
                displayIndex: 'description'
            }
        },
        priority:  {
            name: 'priority',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        note:  {
            name: 'note',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'textarea'
            }
        },
        transport: {
            name: 'transport',
            required: false,
            type: 'transport',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'transportNumber',
                displayIndex: 'nameRoute'
            }
        },
        customer: {
            name: 'customer',
            required: false,
            type: 'customer',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'customerNumber',
                displayIndex: 'name'
            }
        },
        orderLines: {
            name: 'order lines',
            required: false,
            type: 'orderLineList',
            formControl: {
                control: 'table',
                type: 'normal'
            }
        },
    };
    /* order line object map for CRUD */
    public static OrderLineMap = {
        item:  {
            name: 'item',
            required: true,
            unique: true,
            type: 'item',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'sku',
                displayIndex: 'description'
            }
        },
        order:  {
            name: 'order',
            required: false,
            unique: false,
            type: 'order',
            formControl: {
                control: 'select',
                type: 'normal',
                valueIndex: 'orderNumber',
                displayIndex: 'orderNumber'
            }
        },
        qtyRequired:  {
            name: 'qty required',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        createDate: {
            name: 'create date',
            required: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
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
        serial: {
            name: 'serial',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        qualityState:  {
            name: 'qlity state',
            required: false,
            unique: false,
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
        invoiceNumber:  {
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
