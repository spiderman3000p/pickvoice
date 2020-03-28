export const IMPORTING_TYPES = {
    ITEMS: 'items',
    LOCATIONS: 'locations',
    ORDERS: 'orders',
    ORDER_LINE: 'orderLine',
    ORDERS_DTO: 'ordersDto',
    ITEM_TYPE: 'itemTypes',
    UOMS: 'uoms',
    CUSTOMERS: 'customers',
    ORDER_TYPE: 'orderTypes',
    SECTIONS: 'sections',
    TRANSPORTS: 'transports',
    LOADPICKS_DTO: 'loadPicksDto',
    LOCATION_TYPE: 'locationTypes',
    TRANSPORT_STATE: 'transportState',
    ITEM_STATE: 'itemState'
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
    /* customer object map for CRUD */
    public static CustomerMap = {
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
        contact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        phone: {
            name: 'phone',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        address: {
            name: 'address',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        }
    };
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
            type: IMPORTING_TYPES.ITEM_TYPE,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.ITEM_TYPE,
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    console.log('c1', c1);
                    console.log('c2', c2);
                    return c1.code === c2.code;
                }
            },
            addNew: {
                text: 'Add new type',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEM_TYPE
            }
        },
        uom: {
            name: 'item uom',
            required: true,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.UOMS,
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            },
            addNew: {
                text: 'Add new unity',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
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
        },
        itemState: {
            name: 'item state',
            required: true,
            type: IMPORTING_TYPES.ITEM_STATE,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.ITEM_STATE,
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        }
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
    /* Section object map for CRUD */
    public static SectionMap = {
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
            type: IMPORTING_TYPES.SECTIONS,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.SECTIONS,
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            },
            addNew: {
                text: 'Add new section',
                icon: 'add',
                modelType: IMPORTING_TYPES.SECTIONS
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
            type: IMPORTING_TYPES.LOCATION_TYPE,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.LOCATION_TYPE,
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
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
            unique: false,
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
            type: IMPORTING_TYPES.ORDER_TYPE,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.ORDER_TYPE,
                valueIndex: 'code',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            },
            addNew: {
                text: 'Add new order type',
                icon: 'add',
                modelType: IMPORTING_TYPES.ORDER_TYPE
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
        idTransport: {
            name: 'transport',
            required: false,
            type: IMPORTING_TYPES.TRANSPORTS,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.TRANSPORTS,
                valueIndex: 'id',
                displayIndex: 'transportNumber',
                compareFn: (c1, c2) => {
                    return c1.transportNumber === c2.transportNumber;
                }
            },
            addNew: {
                text: 'Add new transport',
                icon: 'add',
                modelType: IMPORTING_TYPES.TRANSPORTS
            }
        },
        customer: {
            name: 'customer',
            required: false,
            type: IMPORTING_TYPES.CUSTOMERS,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.CUSTOMERS,
                valueIndex: 'customerNumber',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.customerNumber === c2.customerNumber;
                }
            },
            addNew: {
                text: 'Add new customer',
                icon: 'add',
                modelType: IMPORTING_TYPES.CUSTOMERS
            }
        },
        orderLines: {
            name: 'order lines',
            required: false,
            type: IMPORTING_TYPES.ORDER_LINE,
            formControl: {
                control: 'table',
                type: 'normal'
            },
            addNew: {
                text: 'Add new order line',
                icon: 'add',
                modelType: IMPORTING_TYPES.ORDER_LINE
            }
        },
    };
    /* order type object map for CRUD */
    public static OrderTypeMap = {
        code: {
            name: 'code',
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
    /* transport object map for CRUD */
    public static TransportMap = {
        transportNumber: {
            name: 'number',
            required: true,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
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
        nameRoute: {
            name: 'route name',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        dispatchPlatforms: {
            name: 'dispatch `platforms',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        carrierCode: {
            name: 'carrier code',
            required: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        transportState: {
            name: 'state',
            required: false,
            type: IMPORTING_TYPES.TRANSPORT_STATE,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.TRANSPORT_STATE,
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        }
    };
    /* order line object map for CRUD */
    public static OrderLineMap = {
        item:  {
            name: 'item',
            required: true,
            unique: true,
            type: IMPORTING_TYPES.ITEMS,
            formControl: {
                control: 'select',
                type: IMPORTING_TYPES.ITEMS,
                valueIndex: 'sku',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.sku === c2.sku;
                }
            },
            addNew: {
                text: 'Add new item',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEMS
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
            unique: false,
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
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        invoiceNumber:  {
            name: 'invoice number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        orderDate:  {
            name: 'order date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        deliveryDate:  {
            name: 'delivery date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        customerNumber:  {
            name: 'customer number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerName:  {
            name: 'customer name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerAddress:  {
            name: 'customer address',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        orderType:  {
            name: 'order type',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
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
                control: 'input',
                type: 'text'
            }
        },
        sku:  {
            name: 'sku',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
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
        uomCode:  {
            name: 'uom code',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        batchNumber:  {
            name: 'batch number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        createDate:  {
            name: 'create date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        expirateDate:  {
            name: 'expirate date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        serial:  {
            name: 'serial',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        qualityState:  {
            name: 'quality state',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        }
    };
    /* loadPick map (for importing proccess) */
    public static LoadPickDtoMap = {
        batchNumber: {
            name: 'batch number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        carrierCode: {
            name: 'carrier code',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        cartonCode: {
            name: 'carton code',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerNumber: {
            name: 'customer number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        customerName: {
            name: 'customer name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        customerAddress: {
            name: 'customer address',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        deliveryDate: {
            name: 'delivery date',
            required: true,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date'
            }
        },
        departureDateTime: {
            name: 'departure time',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        dispatchPlatforms: {
            name: 'dispatch platforms',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        goalTime: {
            name: 'goal item',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        orderNumber: {
            name: 'order number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        pickSequenceNumber: {
            name: 'pick sequence',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        qtyToPicked: {
            name: 'qty to picked',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        route: {
            name: 'route',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        routeName: {
            name: 'route name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        sku: {
            name: 'sku',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        skuDescription: {
            name: 'sku description',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        transportNumber: {
            name: 'trnasport',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                control: 'input',
                type: 'number'
            }
        },
        workType: {
            name: 'work type',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        orderTypeCode: {
            name: 'order type',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        itemTypeCode: {
            name: 'item type',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        uomCode: {
            name: 'uom',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        createDate: {
            name: 'create date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                control: 'date',
                type: 'normal'
            }
        },
        qualityState: {
            name: 'quality state',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        locationCode: {
            name: 'location',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        childrenWork: {
            name: 'children work',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        rootWork: {
            name: 'root work',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                control: 'input',
                type: 'text'
            }
        },
        caseLabelCheckDigits: {
            name: 'case label check digits',
            required: false,
            unique: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        },
        baseItemOverride: {
            name: 'base item',
            required: false,
            unique: false,
            type: 'boolean',
            formControl: {
                control: 'toggle'
            }
        }
    };
}
