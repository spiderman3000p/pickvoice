import { LoadPick as Interface } from '@pickvoice/pickvoice-api/model/loadPick';
export class LoadPick implements Interface {
    /**
     * Identificador único para una orden o pedido. Este número aparece en la interfaz de usuario.
     */
    orderNumber?: string;
    deliveryDate?: string;
    orderTypeCode?: string;
    /**
     * Número de transporte asociada a la orden o conjunto de órdenes.
     */
    transportNumber?: string;
    /**
     * Ruta a la cual pertenece en el transporte; una ruta puede tener consolidado varios transportes.
     */
    route?: string;
    /**
     * Nombre del transporte
     */
    routeName?: string;
    /**
     * Refiere a la puerta por donde se despachar el transporte
     */
    dispatchPlatforms?: string;
    /**
     * Código del transportador
     */
    carrierCode?: string;
    /**
     * Número de cliente asociado a la asignación.
     */
    customerNumber?: string;
    /**
     * Nombre del cliente asociado a la asignación.
     */
    customerName?: string;
    /**
     * Direccion del cliente
     */
    customerAddress?: string;
    /**
     * Numero de referencia del articulo
     */
    sku?: string;
    /**
     * Descripcion del articulo
     */
    skuDescription?: string;
    /**
     * Codigo del tipo de item o familia
     */
    itemTypeCode?: string;
    /**
     * Codigo de la unidad de medida del item de la linea
     */
    uomCode?: string;
    /**
     * Cantidad requerida para picking
     */
    qtyToPicked?: number;
    /**
     * fecha de creacion del producto
     */
    createDate?: string;
    /**
     * fecha de expiracion del producto
     */
    expiryDate?: string;
    /**
     * serial a picking
     */
    serial?: string;
    /**
     * lote requerido a picking
     */
    batchNumber?: string;
    /**
     * Codigo del estado de calidad del producto requerido
     */
    qualityState?: string;
    /**
     * codigo de la localizacion donde se encuentra el producto a picking
     */
    locationCode?: string;
    /**
     * Bandera que indica si un ítem es un elemento de base (sin tener en cuenta su peso y cantidad).
     */
    baseItemOverride?: boolean;
    /**
     * Si se utiliza la etiqueta caso dígitos de control, este valor que debe ser especificado por el operador para asegurarse de que la etiqueta apropiada será puesta en un contenedor.
     */
    caseLabelCheckDigits?: boolean;
    /**
     * codigo de etiqueta donde se requiere retirar el material o articulo
     */
    cartonCode?: string;
    /**
     * Especifica el orden en que el Pick Voice selecciona e indica los picks para un operador.
     */
    pickSequenceNumber?: number;
    /**
     * Identificador de trabajo para la tarea.
     */
    childrenWork?: string;
    /**
     * Meta de tiempo para completar esta tarea.
     */
    goalTime?: number;
    /**
     * La fecha en que el camión va a salir del almacén.
     */
    departureDateTime?: string;
    /**
     * trabajo primario a la cual pertenece la orden
     */
    rootWork?: string;
    /**
     * Tipo de agrupacion para escalar las tareas
     */
    workType?: Interface.WorkTypeEnum;
    constructor() {
        this.baseItemOverride = false;
        this.batchNumber = '';
        this.carrierCode = '';
        this.cartonCode = '';
        this.caseLabelCheckDigits = false;
        this.childrenWork = '';
        this.createDate = '';
        this.customerAddress = '';
        this.customerName = '';
        this.deliveryDate = '';
        this.departureDateTime = '';
        this.dispatchPlatforms = '';
        this.expiryDate = '';
        this.goalTime = 0;
        this.itemTypeCode = '';
        this.locationCode = '';
        this.orderNumber = '';
        this.orderTypeCode = '';
        this.pickSequenceNumber = 0;
        this.qtyToPicked = 0;
        this.qualityState = '';
        this.rootWork = '';
        this.route = '';
        this.routeName = '';
        this.serial = '';
        this.sku = '';
        this.skuDescription = '';
        this.transportNumber = '';
        this.uomCode = '';
        this.workType = Interface.WorkTypeEnum.Order;
    }
}
