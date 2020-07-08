/* IMPORTING_TYPES: models data type string descriptions */
export const IMPORTING_TYPES = {
    STORES: 'stores',
    DEPOTS: 'depots',
    OWNERS: 'owners',
    PLANTS: 'plants',
    INVENTORY_CLASSIFICATION: 'inventoryClassification',
    LPN_INTERVAL: 'lpnInterval',
    LPN_STATE: 'lpnState',
    LPN_INTERFACE: 'lpnInterface',
    LPN_LOCATION: 'lpnLocation',
    LPN_TYPE: 'lpnType',
    INVENTORY: 'inventory',
    LPN: 'lpn',
    LPN_LIST: 'lpnList',
    USERS: 'users',
    ITEMS: 'items',
    ITEMS_LIST: 'itemsList',
    ITEM_CLASSIFICATIONS: 'itemClassifications',
    LOADITEMS_DTO: 'itemsDto',
    ITEMUOMS: 'itemUoms',
    LOADITEMUOMS_DTO: 'itemUomsDto',
    LOCATIONS: 'locations',
    LOCATIONS_LIST: 'locationsList',
    LOCATION_STATE: 'locationState',
    OPERATION_TYPE: 'operationType',
    LOADLOCATIONS_DTO: 'locationsDto',
    RACK_TYPE: 'rackType',
    QUALITY_STATES: 'qualityStates',
    QUALITY_STATE_TYPES: 'qualityStateTypes',
    ORDERS: 'orders',
    ORDERS_LIST: 'ordersList',
    ORDERS_TO_ASSIGN: 'ordersToAssign',
    ORDER_LINE: 'orderLine',
    LOADORDERS_DTO: 'ordersDto',
    ITEM_TYPE: 'itemTypes',
    UOMS: 'uoms',
    CUSTOMERS: 'customers',
    CUSTOMERS_LIST: 'customersList',
    ORDER_TYPE: 'orderTypes',
    SECTIONS: 'sections',
    TRANSPORTS: 'transports',
    TRANSPORTS_LIST: 'transportsList',
    PICK_PLANNINGS: 'pickPlannings',
    PICK_PLANNINGS_LIST: 'pickPlanningsList',
    PICK_TASKS: 'pickTasks',
    PICK_TASKS_LIST: 'pickTasksList',
    PICK_TASKLINES: 'pickTaskLines',
    TASK_TYPES: 'taskTypes',
    DOCKS: 'docks',
    DOCKS_LIST: 'docksList',
    LOADPICKS_DTO: 'loadPicksDto',
    LOCATION_TYPE: 'locationTypes',
    DOCK_TYPE: 'dockType',
    TRANSPORT_STATE: 'transportState',
    ITEM_STATE: 'itemState',
    TASK_STATE: 'taskState',
    PICK_STATE: 'pickPlanningState'
};
/* FILTER_TYPES is used in column filters */
export const FILTER_TYPES = [
    {
        value: 'equals',
        name: 'Equal',
        availableForTypes: ['number', 'text', 'date']
    },
    {
        value: 'notEqual',
        name: 'Not equal',
        availableForTypes: ['text', 'number', 'date']
    },
    {
        value: 'contains',
        name: 'Contains',
        availableForTypes: ['text']
    },
    {
        value: 'notContains',
        name: 'Not contains',
        availableForTypes: ['text']
    },
    {
        value: 'startsWith',
        name: 'Starts with',
        availableForTypes: ['text']
    },
    {
        value: 'endsWith',
        name: 'Ends with',
        availableForTypes: ['text']
    },
    {
        value: 'lessThan',
        name: 'Less than',
        availableForTypes: ['number', 'date']
    },
    {
        value: 'lessThanOrEqual',
        name: 'Less than or equal',
        availableForTypes: ['number', 'date']
    },
    {
        value: 'greaterThan',
        name: 'Greater than',
        availableForTypes: ['number', 'date']
    },
    {
        value: 'inRange',
        name: 'In range',
        availableForTypes: ['number', 'date']
    }
];
/* Common tasks status (  PE - Pending, WP - Work In Progress,CP - Complete,CA - Canceled) */
export const STATES = {
    PE: 'PENDING',
    CA: 'CANCELED',
    PS: 'PAUSED',
    AC: 'ACTIVATED',
    WP: 'IN PROGRESS',
    CP: 'COMPLETED',

    OI: 'Open Interface',
    CI: 'Close Interface',

    PG: 'Pre-Generado',
    RR: 'Reside en recepcion',
    RQ: 'Reside en cuarentena',
    RI: 'Reside en el inventario',
    IT: 'Transito interno',
    WI: 'Reside en WIP',
    OT: 'Transito de salida',
    RS: 'Reside en las tiendas',
    NL: 'No localizado',
    NS: 'Stock no apto'
};
/*
    Esta clase contiene propiedades estaticas. Cada propiedad se refiere a una entidad distinta.
    Cada propiedad aqui especificada, corresponde a las columnas de los archivos de importacion
    (csv, xlsx) para cada entidad, y se especifican su nombre para usar en el header de la tabla en la
    pantalla de importacion, si son columnas requeridas, unicas, el valor minimo, el valor maximo, y el
    tipo de dato (en caso de que sea distinto a un string y necesite un input especial, como las
    fechas por ejemplo).

    Los atributos validados hasta ahora son:
    required: la columna no puede estar vacia
    unique: el valor no puede repetirse en el mismo archivo (en el caso de las importaciones),
    min: valor minimo aceptado en los campos tipo number,
    max: valor maximo aceptado en los campos tipo number,
    type: tipo de dato
    formControl: objeto que controla los aspectos de un control de formulario
    validate: no recuerdo
    addNew: la capacidad de poder agregar un nuevo registro, en el caso de los combos o selects
*/
export class ModelMap {
    /*********************************************
    *           Object's for CRUD's
    **********************************************/
    /* plant object map for CRUD */
    public static PlantsMap = {
        name: {
            name: 'name',
            required: true,
            type: 'string',
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        address: {
            name: 'address',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        contact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        email: {
            name: 'email',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'email'
            }
        },
        phone1: {
            name: 'phone 1',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        phone2: {
            name: 'phone 2',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        }
    };
    /* depot object map for CRUD */
    public static DepotsMap = {
        name: {
            name: 'name',
            required: true,
            type: 'string',
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* owner object map for CRUD */
    public static OwnersMap = {
        name: {
            name: 'name',
            required: true,
            type: 'string',
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        address: {
            name: 'address',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        contact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        email: {
            name: 'email',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'email'
            }
        },
        ean13: {
            name: 'ean13',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        phone1: {
            name: 'phone 1',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        phone2: {
            name: 'phone 2',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        pcl: {
            name: 'pcl',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* store object map for CRUD */
    public static StoresMap = {
        name: {
            name: 'name',
            required: true,
            type: 'string',
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        address: {
            name: 'address',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        contact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        email: {
            name: 'email',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'email'
            }
        },
        ean13: {
            name: 'ean13',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        phone1: {
            name: 'phone 1',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        phone2: {
            name: 'phone 2',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        customerId: {
            name: 'customer',
            required: false,
            type: IMPORTING_TYPES.CUSTOMERS_LIST,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'customerId',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        }
    };
    /* task type map for CRUD */
    public static TaskTypeMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* lpns object map for CRUD */
    public static LpnMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnType: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.LPN_TYPE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        lpnState: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.LPN_STATE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        lpnInterface: {
            name: 'interface',
            required: true,
            type: IMPORTING_TYPES.LPN_INTERFACE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        locationId: {
            name: 'location',
            required: true,
            type: IMPORTING_TYPES.LPN_LOCATION,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        },
        location: {
            name: 'location',
            required: true,
            type: IMPORTING_TYPES.LPN_LOCATION,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        }
    };
    /* lpn interval object map for CRUD */
    public static LpnIntervalMap = {
        fromToNumber: {
            name: 'from',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        upToNumber: {
            name: 'to',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        currentInterval: {
            name: 'current interval',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        labelTemplateId: {
            name: 'label template',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        },
        prefijo: {
            name: 'prefijo',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        state: {
            name: 'state',
            required: true,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle',
                type: 'boolean'
            }
        }
    };
    /* lpnVO3 object map for CRUD */
    public static LpnVO3Map = {
        activationDate: {
            name: 'activation date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'text'
            }
        },
        closingDate: {
            name: 'closing date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'text'
            }
        },
        openingDate: {
            name: 'opening date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'text'
            }
        },
        depotId: {
            name: 'depot id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        ownerId: {
            name: 'owner id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnChilds: {
            name: 'childs',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        lpnState: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.LPN_STATE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        lpnInterface: {
            name: 'interface',
            required: true,
            type: IMPORTING_TYPES.LPN_INTERFACE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        lpnType: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.LPN_TYPE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        locationCode: {
            name: 'location code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationState: {
            name: 'location state',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationType: {
            name: 'location type',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationId: {
            name: 'location id',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnId: {
            name: 'id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        }
    };
    /* lpnItemVO2 object map for CRUD */
    public static LpnItemVO2Map = {
        createDate: {
            name: 'create date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'text'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'text'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemType: {
            name: 'type',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnItemId: {
            name: 'item id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qty: {
            name: 'qty',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qtyAvailable: {
            name: 'qty available',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qtyBooking: {
            name: 'qty booking',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        serial: {
            name: 'serial',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sku: {
            name: 'sku',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        skuDescription: {
            name: 'sku description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        weight: {
            name: 'weight',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        }
    };
    /* lpns object map for CRUD */
    public static LpnListMap = {
        lpn: {
            name: 'lpn',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        type: {
            name: 'type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        state: {
            name: 'state',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        interface: {
            name: 'interface',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        location: {
            name: 'location',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* inventory object map for CRUD */
    public static InventoryItemMap = {
        lpnItemId: {
            name: 'lpn item id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        lpnId: {
            name: 'lpn id',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        inboundDate: {
            name: 'inbound date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        lpnCode: {
            name: 'lpn code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnState: {
            name: 'state',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomName: {
            name: 'uom name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnType: {
            name: 'lpn type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationType: {
            name: 'location type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationId: {
            name: 'location id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        itemId: {
            name: 'item id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        itemSku: {
            name: 'item sku',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemDescription: {
            name: 'item description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemTypeId: {
            name: 'item type id',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemTypeName: {
            name: 'item type name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        cost: {
            name: 'cost',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qty: {
            name: 'qty',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 999999
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        createdDate: {
            name: 'created date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        weight: {
            name: 'weight',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        classification: {
            name: 'classification',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* customer object map for CRUD */
    public static CustomerMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        contact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        phone: {
            name: 'phone',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        address: {
            name: 'address',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        postalCode: {
            name: 'postal code',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        gln: {
            name: 'gln',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        longitude: {
            name: 'longitude',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        latitude: {
            name: 'latitude',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        zone: {
            name: 'zone',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        neighborhood: {
            name: 'neighborhood',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* customer object map for LIST */
    public static CustomerListMap = {
        customerCode: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerContact: {
            name: 'contact',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerPhone: {
            name: 'phone',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        customerCityCode: {
            name: 'city code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        cityName: {
            name: 'city name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerZone: {
            name: 'zone',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerNeighborhood: {
            name: 'neiborhood',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerPostalCode: {
            name: 'zip',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        customerLatitude: {
            name: 'latitude',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        customerLongitude: {
            name: 'longitude',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
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
                helpText: 'Sku de item',
                control: 'input',
                type: 'text'
            }
        },
        upc: {
            name: 'upc',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'Upc de item',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'item description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'hola',
                control: 'textarea',
                type: 'text'
            }
        },
        phonetic: {
            name: 'phonetic description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemTypeId: {
            name: 'item type',
            required: true,
            type: IMPORTING_TYPES.ITEM_TYPE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new type',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEM_TYPE
            }
        },
        qualityStateId: {
            name: 'quality state',
            required: true,
            type: IMPORTING_TYPES.QUALITY_STATES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new quality state',
                icon: 'add',
                modelType: IMPORTING_TYPES.QUALITY_STATES
            }
        },
        uomHandlingId: {
            name: 'uom handling',
            required: true,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new unity',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        uomPackingId: {
            name: 'uom packing',
            required: true,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new unity',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        uomInboundId: {
            name: 'uom inbound',
            required: true,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new unity',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        uomOutboundId: {
            name: 'uom outbound',
            required: true,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
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
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        scannedVerification: {
            name: 'scanner verification id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        spokenVerification: {
            name: 'spoken verification id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        state: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.ITEM_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        classification: {
            name: 'classification',
            required: true,
            type: IMPORTING_TYPES.ITEM_CLASSIFICATIONS,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        cost: {
            name: 'cost',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        tolerance: {
            name: 'tolerance',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        shelfLife: {
            name: 'shelf life',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        weight: {
            name: 'item weight',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        variableWeight: {
            name: 'variable weight',
            required: true,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        serial: {
            name: 'item serial',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        }
    };
    /* item object map for LIST */
    public static ItemListMap = {
        itemSku: {
            name: 'sku',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemUpc: {
            name: 'upc',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemDescription: {
            name: 'description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        itemPhonetic: {
            name: 'phonetic',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemTypeCode: {
            name: 'type code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemTypeName: {
            name: 'type name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemQstCode: {
            name: 'qlty stt code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemQstName: {
            name: 'qlty stt name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomHandlingCode: {
            name: 'uom handling code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomHandlingName: {
            name: 'uom handling name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomPackingCode: {
            name: 'uom packing code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomPackingName: {
            name: 'uom packing name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomInboundCode: {
            name: 'uom inbound code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomInboundName: {
            name: 'uom inbound name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomOutboundCode: {
            name: 'uom outbound code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomOutboundName: {
            name: 'uom outbound name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        itemWeight: {
            name: 'weight',
            required: true,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'boolean'
            }
        },
        itemBatchNumber: {
            name: 'batch number',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text'
            }
        },
        itmVariableWeight: {
            name: 'variable weight',
            required: true,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text'
            }
        },
        itemExpiryDate: {
            name: 'expiry date',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text'
            }
        },
        itemCreateDate: {
            name: 'create date',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text'
            }
        },
        itemSerial: {
            name: 'serial',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text'
            }
        }
    };
    /* item type object map for CRUD */
    public static ItemTypeMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        }
    };
    /* item uom object map for CRUD */
    public static ItemUomMap = {
        denominator: {
            name: 'denominator',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 999999
            }
        },
        numerator: {
            name: 'numerator',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        factor: {
            name: 'factor',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        length: {
            name: 'length',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        width: {
            name: 'width',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 999999
            }
        },
        unitsPallet: {
            name: 'units pallet',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 999999
            }
        },
        height: {
            name: 'height',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 999999
            }
        },
        eanCode: {
            name: 'ean code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomId: {
            name: 'uom',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new uom',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        dimensionUomId: {
            name: 'dimension uom',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new uom',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        volumenUomId: {
            name: 'volumen uom',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new uom',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        weightUomId: {
            name: 'weight uom',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new uom',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        itemId: {
            name: 'item',
            required: false,
            type: IMPORTING_TYPES.ITEMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'itemId',
                displayIndex: 'itemDescription',
                compareFn: (c1, c2) => {
                    return c1.itemId === c2.itemId;
                }
            },
            addNew: {
                text: 'Add new item',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEMS
            }
        }
    };
    /* quality state object map for CRUD */
    public static QualityStateMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        optionalCode: {
            name: 'optional code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        qualityStateTypeId: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.QUALITY_STATE_TYPES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                displayIndex: 'name',
                valueIndex: 'id',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        },
        state: {
            name: 'status',
            required: true,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        }
    };
    /* quality state type object map for CRUD */
    public static QualityStateTypeMap = {
        code: {
            name: 'code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* unity of measure object map for CRUD */
    public static UomMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* Section object map for CRUD */
    public static SectionMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        name: {
            name: 'name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        }
    };
    /* location object map for CRUD */
    public static LocationMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        sectionId: {
            name: 'section',
            required: true,
            type: IMPORTING_TYPES.SECTIONS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
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
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        columnAt: {
            name: 'column',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        height: {
            name: 'height',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        depth: {
            name: 'depth',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        checkDigit: {
            name: 'check digit',
            required: false,
            unique: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 1,
                max: 99999,
                minlength: 1,
                maxlength: 5
            }
        },
        locationType: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.LOCATION_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        operationType: {
            name: 'operation',
            required: true,
            type: IMPORTING_TYPES.OPERATION_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        rackType: {
            name: 'rack type',
            required: false,
            type: IMPORTING_TYPES.RACK_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        widthSize: {
            name: 'width',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 1,
                max: 99999
            }
        },
        heightSize: {
            name: 'height',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        depthSize: {
            name: 'depth',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        allowedLpns: {
            name: 'allowed lpns',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        locationState: {
            name: 'state',
            required: false,
            type: IMPORTING_TYPES.LOCATION_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        pickHeight: {
            name: 'pick height',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        multireference: {
            name: 'multi reference',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        }
    };
    /* location object map for LIST */
    public static LocationListMap = {
        depotCode: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        depotName: {
            name: 'depot',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sectionCode: {
            name: 'section code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sectionName: {
            name: 'section name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        locationCode: {
            name: 'location code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationRackType: {
            name: 'rack type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationType: {
            name: 'location type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationState: {
            name: 'state',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationLane: {
            name: 'lane',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationColumn: {
            name: 'column',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationHeight: {
            name: 'height',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationDepth: {
            name: 'depth',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationAllowedLpns: {
            name: 'allowed pns',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* order object map for CRUD */
    public static OrderMap = {
        orderNumber: {
            name: 'order number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        purchaseNumber: {
            name: 'purchase number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        invoiceNumber: {
            name: 'invoice number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        orderDate: {
            name: 'order date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        deliveryDate: {
            name: 'delivery date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        orderTypeId: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.ORDER_TYPE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new order type',
                icon: 'add',
                modelType: IMPORTING_TYPES.ORDER_TYPE
            }
        },
        priority: {
            name: 'priority',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        note: {
            name: 'note',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea'
            }
        },
        transportId: {
            name: 'transport',
            required: true,
            type: IMPORTING_TYPES.TRANSPORTS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'transportId',
                displayIndex: 'transportNumber',
                compareFn: (c1, c2) => {
                    return c1.transportId === c2.transportId;
                }
            },
            addNew: {
                text: 'Add new transport',
                icon: 'add',
                modelType: IMPORTING_TYPES.TRANSPORTS
            }
        },
        customerId: {
            name: 'customer',
            required: true,
            type: IMPORTING_TYPES.CUSTOMERS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'customerId',
                displayIndex: 'customerName',
                compareFn: (c1, c2) => {
                    return c1.customerId === c2.customerId;
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
                helpText: 'descripcion corta',
                control: 'table',
                type: 'normal'
            },
            addNew: {
                text: 'Add new order line',
                icon: 'add',
                modelType: IMPORTING_TYPES.ORDER_LINE
            }
        }
    };
    /* order object map for LIST */
    public static OrderListMap = {
        orderNumber: {
            name: 'order number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        orderPurchaseNumber: {
            name: 'purchase number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        orderInvoiceNumber: {
            name: 'invoice number',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        orderDate: {
            name: 'order date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        orderDeliveryDate: {
            name: 'delivery date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        orderPriority: {
            name: 'priority',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        orderNote: {
            name: 'note',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea'
            }
        },
        customerCode: {
            name: 'customer code',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'customer name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerPhone: {
            name: 'customer phone',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        customerCityCode: {
            name: 'customer city code',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerCityName: {
            name: 'customer city name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* order type object map for CRUD */
    public static OrderTypeMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        }
    };
    /* transport object map for CRUD */
    public static TransportMap = {
        transportNumber: {
            name: 'number',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        route: {
            name: 'route',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        nameRoute: {
            name: 'route name',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        carrierCode: {
            name: 'carrier code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        shipmentDate: {
            name: 'shipment date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        transportationStatus: {
            name: 'state',
            required: false,
            type: IMPORTING_TYPES.TRANSPORT_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        vehicle: {
            name: 'vehicle',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        containerNumber: {
            name: 'container number',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        weight: {
            name: 'weight',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        trailer: {
            name: 'trailer',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomWeightId: {
            name: 'uom weight',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        },
        uomVolumeId: {
            name: 'uom volume',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        plannedCheckin: {
            name: 'planned checkin',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        actualCheckin: {
            name: 'actual checkin',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        plannedStartLoading: {
            name: 'planned start loading',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        currentStartLoading: {
            name: 'current start loading',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        plannedEndLoading: {
            name: 'planned end loading',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        actualEndLoading: {
            name: 'actual end loading',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        plannedShipmentCompletion: {
            name: 'planned shipment completion',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        currentShipmentCompletion: {
            name: 'current shipment completion',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        }
    };
    /* transport object map for LIST */
    public static TransportListMap = {
        transportNumber: {
            name: 'number',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        transportRoute: {
            name: 'route',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        carrierCode: {
            name: 'carrier code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        transportShipmentDate: {
            name: 'shipment date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        transportContainerNumber: {
            name: 'container number',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        transportVehicle: {
            name: 'vehicle',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        weight: {
            name: 'weight',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        uomWeightCode: {
            name: 'uom weight code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomWeightName: {
            name: 'uom weight name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomVolumeCode: {
            name: 'uom volume code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        transportDescription: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        volume: {
            name: 'volume',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        transportationState: {
            name: 'state',
            required: false,
            type: IMPORTING_TYPES.TRANSPORT_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
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
        itemId: {
            name: 'item',
            required: true,
            unique: true,
            type: IMPORTING_TYPES.ITEMS_LIST,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: 'itemId',
                displayIndex: 'itemDescription',
                compareFn: (c1, c2) => {
                    return c1.itemId === c2.itemId;
                }
            },
            addNew: {
                text: 'Add new item',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEMS
            }
        },
        qtyRequired: {
            name: 'qty required',
            required: true,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        batchNumber: {
            name: 'batch number',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        createDate: {
            name: 'create date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        qualityState: {
            name: 'quality state',
            required: true,
            unique: false,
            type: IMPORTING_TYPES.QUALITY_STATES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new quality',
                icon: 'add',
                modelType: IMPORTING_TYPES.QUALITY_STATES
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
    /* picking planning object map for CRUD */
    public static PickPlanningMap = {
        targetDockId: {
            name: 'dock',
            required: true,
            type: IMPORTING_TYPES.DOCKS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new dock',
                icon: 'add',
                modelType: IMPORTING_TYPES.DOCKS
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        state: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.PICK_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1: any, c2: any) => {
                    return c1 === c2;
                }
            }
        },
        progress: {
            name: 'progress',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                max: 100,
                min: 0,
                maxlength: 3
            }
        },
        processDate: {
            name: 'process date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        rootWork: {
            name: 'root work',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* picking planning object map for CRUD */
    public static PickPlanningListMap = {
        pickPlanningDescription: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        pickPlanningRoot: {
            name: 'root',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        pickPlanningType: {
            name: 'root',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockCode: {
            name: 'dock code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockDescription: {
            name: 'dock description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        pickPlanningProgress: {
            name: 'progress',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100,
                maxlength: 3
            }
        },
        processDate: {
            name: 'process date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
    };
    /* picking task object map for CRUD */
    public static PickTaskMap = {
        description: {
            name: 'description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        enableDate: {
            name: 'enable date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        dateAssignment: {
            name: 'date assignment',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        date: {
            name: 'date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        priority: {
            name: 'priority',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        lines: {
            name: 'lines',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qty: {
            name: 'qty',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        document: {
            name: 'document',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        currentLine: {
            name: 'current line',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
            }
        },
        childrenWork: {
            name: 'chidren work',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
            }
        },
        taskState: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.TASK_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        userId: {
            name: 'user',
            required: true,
            type: IMPORTING_TYPES.USERS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'userName',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            /*addNew: {
                text: 'Add new user',
                icon: 'add',
                modelType: IMPORTING_TYPES.USERS
            }*/
        },
        taskTypeId: {
            name: 'type',
            required: true,
            type: IMPORTING_TYPES.TASK_TYPES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'number',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new type',
                icon: 'add',
                modelType: IMPORTING_TYPES.TASK_TYPES
            }
        }
    };
    /* picking task object map for list */
    public static PickTaskVO3Map = {
        description: {
            name: 'description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        enableDate: {
            name: 'enable date',
            required: true,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        priority: {
            name: 'priority',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        dockCode: {
            name: 'dock code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockType: {
            name: 'dock type',
            required: true,
            type: 'text',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        taskState: {
            name: 'state',
            required: true,
            type: IMPORTING_TYPES.TASK_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        userName: {
            name: 'user',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            },
            /*addNew: {
                text: 'Add new user',
                icon: 'add',
                modelType: IMPORTING_TYPES.USERS
            }*/
        },
        taskType: {
            name: 'type',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sku: {
            name: 'sku',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'customer',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnCode: {
            name: 'lpn code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationCode: {
            name: 'location code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        currentLine: {
            name: 'current line',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        taskName: {
            name: 'task name',
            required: true,
            type: 'text',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        numberLines: {
            name: 'lines',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        taskProgress: {
            name: 'progress',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        }
    };
    /* picking task object map for list in edit picking planning */
    public static PickTaskMapCustom = {
        description: {
            name: 'description',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        orderNumber: {
            name: 'order number',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'customer name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sku: {
            name: 'sku',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnCode: {
            name: 'lpn code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationCode: {
            name: 'location code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        currentLine: {
            name: 'current line',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockId: {
            name: 'dock Id',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockCode: {
            name: 'dock code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockType: {
            name: 'dock type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        taskName: {
            name: 'task name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        taskState: {
            name: 'task state',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        enableDate: {
            name: 'enable date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        priority: {
            name: 'priority',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        userName: {
            name: 'user name',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        numberLines: {
            name: 'number lines',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        taskProgress: {
            name: 'progress',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100,
                maxlength: 3
            }
        }
    };
    /* picking task line object map for CRUD (not used) */
    public static PickTaskLineMap = {
        lpnItemId: {
            name: 'lpn',
            required: true,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        sku: {
            name: 'sku',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        skuDescription: {
            name: 'sku description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        expiryDate: {
            name: 'expiry Date',
            required: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        batchNumber: {
            name: 'batch Number',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        sectionCode: {
            name: 'section code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text',
            }
        },
        locationId: {
            name: 'location id',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationCode: {
            name: 'location code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text',
            }
        },
        locationCheckDigit: {
            name: 'location check digitl',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
            }
        },
        qtyToPicked: {
            name: 'qty to pick',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        uomId: {
            name: 'uom id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        lpnId: {
            name: 'lpn id',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        uomCode: {
            name: 'uom code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        lpnCode: {
            name: 'lpn code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        pickSequenceNumber: {
            name: 'pick sequence number',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        scannedVerification: {
            name: 'scanned verification',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        spokenVerification: {
            name: 'spoken verification',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }
    };
    /* dock object map for CRUD */
    public static DockMap = {
        dockType: {
            name: 'dock type',
            required: true,
            type: IMPORTING_TYPES.DOCK_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        sectionId: {
            name: 'section',
            required: true,
            type: IMPORTING_TYPES.SECTIONS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: 'id',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new section',
                icon: 'add',
                modelType: IMPORTING_TYPES.SECTIONS
            }
        },
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        locationType: {
            name: 'location type',
            required: true,
            type: IMPORTING_TYPES.LOCATION_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        locationState: {
            name: 'location state',
            required: true,
            type: IMPORTING_TYPES.LOCATION_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        }
    };
    /* dock object map for LIST */
    public static DockListMap = {
        code: {
            name: 'code',
            required: false,
            type: 'string',
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        dockType: {
            name: 'type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationType: {
            name: 'location type',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationState: {
            name: 'location state',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sectionCode: {
            name: 'section code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        } /*
        depotName: {
            name: 'depot',
            required: false,
            type: 'string',
            formControl: {
helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        plantCode: {
            name: 'plant code',
            required: false,
            type: 'string',
            validate: true,
            formControl: {
helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        plantName: {
            name: 'plant name',
            required: false,
            type: 'string',
            validate: true,
            formControl: {
helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        }*/
    };
    /*********************************************
    *        DTO's for importing files
    **********************************************/

    /* order dto map (for importing proccess) */
    public static LoadOrderDtoMap = {
        orderNumber: {
            name: 'order number',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        purchaseNumber: {
            name: 'purchase number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        invoiceNumber: {
            name: 'invoice number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        orderDate: {
            name: 'order date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        deliveryDate: {
            name: 'delivery date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        customerNumber: {
            name: 'customer number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        customerName: {
            name: 'customer name',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        orderType: {
            name: 'order type',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        priority: {
            name: 'priority',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        note: {
            name: 'note',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        sku: {
            name: 'sku',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        qtyRequired: {
            name: 'qty required',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        uomCode: {
            name: 'uom code',
            required: false,
            unique: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: 'code',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        expirateDate: {
            name: 'expirate date',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        qualityState: {
            name: 'quality state',
            required: false,
            unique: false,
            type: IMPORTING_TYPES.QUALITY_STATES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        }
    };
    /* loadPick map (for importing process) */
    public static LoadPickDtoMap = {
        batchNumber: {
            name: 'batch number',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'date'
            }
        },
        departureDateTime: {
            name: 'departure time',
            required: false,
            unique: false,
            type: 'date',
            formControl: {
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        dispatchPlatforms: {
            name: 'dispatch platforms',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        goalTime: {
            name: 'goal item',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        transportNumber: {
            name: 'trnasport',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'date',
                type: 'date'
            }
        },
        qualityState: {
            name: 'quality state',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
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
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        baseItemOverride: {
            name: 'base item',
            required: false,
            unique: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        }
    };
    /* item dto map (for importing process) */
    public static LoadItemDtoMap = {
        sku: {
            name: 'sku',
            required: true,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        upc: {
            name: 'upc',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        phonetic: {
            name: 'phonetic',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            unique: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        weight: {
            name: 'weight',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        variableWeight: {
            name: 'variable weight',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        weightTolerance: {
            name: 'weight tolerance',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        expiryDate: {
            name: 'expiry date',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        serial: {
            name: 'serial',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        batchNumber: {
            name: 'batch number',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        scannedVerification: {
            name: 'scanned verification',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        spokenVerification: {
            name: 'spoken verification',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        state: {
            name: 'state',
            required: false,
            type: IMPORTING_TYPES.ITEM_STATE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: null,
                displayIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        itemTypeCode: {
            name: 'type code',
            required: false,
            type: IMPORTING_TYPES.ITEM_TYPE,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text',
                valueIndex: 'code',
                displayIndex: 'description',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            }
        },
        uomCode: {
            name: 'uom code',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text',
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            }
        },
        classification: {
            name: 'classification',
            required: true,
            type: IMPORTING_TYPES.ITEM_CLASSIFICATIONS,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        cost: {
            name: 'cost',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        tolerance: {
            name: 'tolerance',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 100
            }
        },
        shelfLife: {
            name: 'shelf life',
            required: false,
            unique: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        qualityStatesCode: {
            name: 'quality state',
            required: false,
            unique: false,
            type: IMPORTING_TYPES.QUALITY_STATES,
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text',
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.code === c2.code;
                }
            }
        }
    };
    /* item uom dto map (for importing process) */
    public static LoadItemUomDtoMap = {
        denominator: {
            name: 'denominator',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        numerator: {
            name: 'numerator',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        factor: {
            name: 'factor',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        length: {
            name: 'length',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        width: {
            name: 'width',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        height: {
            name: 'height',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        eanCode: {
            name: 'ean code',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        uomCode: {
            name: 'uom',
            required: false,
            type: IMPORTING_TYPES.UOMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: 'code',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.id === c2.id;
                }
            },
            addNew: {
                text: 'Add new uom',
                icon: 'add',
                modelType: IMPORTING_TYPES.UOMS
            }
        },
        itemSku: {
            name: 'item',
            required: false,
            type: IMPORTING_TYPES.ITEMS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                valueIndex: 'sku',
                displayIndex: 'name',
                compareFn: (c1, c2) => {
                    return c1.sku === c2.sku;
                }
            },
            addNew: {
                text: 'Add new item',
                icon: 'add',
                modelType: IMPORTING_TYPES.ITEMS
            }
        }
    };
    /* locationr dto map for importing process */
    public static LoadLocationDtoMap = {
        code: {
            name: 'code',
            required: true,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        description: {
            name: 'description',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'textarea',
                type: 'text'
            }
        },
        sectionCode: {
            name: 'section',
            required: false,
            type: IMPORTING_TYPES.SECTIONS,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
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
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        columnAt: {
            name: 'column',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        height: {
            name: 'height',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        depth: {
            name: 'deep',
            required: false,
            type: 'string',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'text'
            }
        },
        locationType: {
            name: 'type',
            required: false,
            type: IMPORTING_TYPES.LOCATION_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        operationType: {
            name: 'operation',
            required: false,
            type: IMPORTING_TYPES.OPERATION_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        locationState: {
            name: 'status',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        rackType: {
            name: 'rack type',
            required: false,
            type: IMPORTING_TYPES.RACK_TYPE,
            validate: true,
            formControl: {
                helpText: 'descripcion corta',
                control: 'select',
                type: 'text',
                displayIndex: null,
                valueIndex: null,
                compareFn: (c1, c2) => {
                    return c1 === c2;
                }
            }
        },
        multireference: {
            name: 'multi reference',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        },
        widthSize: {
            name: 'width',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        heightSize: {
            name: 'height',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        depthSize: {
            name: 'depth',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number',
                min: 0,
                max: 99999
            }
        },
        allowedLpns: {
            name: 'allowed lpns',
            required: false,
            type: 'number',
            formControl: {
                helpText: 'descripcion corta',
                control: 'input',
                type: 'number'
            }
        },
        pickHeight: {
            name: 'pick height',
            required: false,
            type: 'boolean',
            formControl: {
                helpText: 'descripcion corta',
                control: 'toggle'
            }
        }
    };
}
