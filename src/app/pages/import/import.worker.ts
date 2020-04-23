/// <reference lib="webworker" />
/*import { Section, ItemType, UnityOfMeasure, Item } from '@pickvoice/pickvoice-api';
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
import { ValidationError } from './validation-error';
import { environment } from '../../../environments/environment';
*/
import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
const dataTypesModelMaps = {
  items: ModelMap.ItemMap,
  itemsDto: ModelMap.LoadItemDtoMap,
  itemUomsDto: ModelMap.LoadItemUomDtoMap,
  itemTypes: ModelMap.ItemTypeMap,
  locations: ModelMap.LocationMap,
  locationsDto: ModelMap.LoadLocationDtoMap,
  orders: ModelMap.OrderMap,
  uoms: ModelMap.UomMap,
  ordersDto: ModelMap.LoadOrderDtoMap,
  customers: ModelMap.CustomerMap,
  orderTypes: ModelMap.OrderTypeMap,
  sections: ModelMap.SectionMap,
  transports: ModelMap.TransportMap,
  loadPicksDto: ModelMap.LoadPickDtoMap,
  pickPlannings: ModelMap.PickPlanningMap,
  pickTasks: ModelMap.PickTaskMap,
  pickTaskLines: ModelMap.PickTaskLineMap,
  docks: ModelMap.DockMap
};
let globalData;
let response;
addEventListener('message', ({ data }) => {
  if (data && data.action) {
    globalData = data;
    switch (data.action) {
      case 'mapData': mapData(); break;
      case 'validateData': validateData(); break;
      default: response = { type: 'error', message: 'Invalid data'};
               postMessage(response);
    }
  }
});

function mapData() {
  // formateamos la data
  let headers = dataTypesModelMaps[globalData.selectedType];
  if (!headers) {
    postMessage({type: 'error', message: 'headers invalid in validate data', data: {
      map: dataTypesModelMaps[globalData.selectedType],
      type: globalData.selectedType
    }});
    return;
  }
  let batchMapedData = [];
  globalData.data.forEach((row, rowIndex) => {
    for (const field in headers) {
      if (1) {
        // arreglamos los valores booleanos en caso de que esten en formato texto mayusculas
        if (headers[field].type === 'boolean' && typeof row[field] === 'string') {
          if (row[field] === 'true' || row[field] === 'TRUE') {
            row[field] = true;
          }
          if (row[field] === 'false' || row[field] === 'FALSE') {
            row[field] = false;
          }
        }
        if (globalData.selectedType === IMPORTING_TYPES.LOADITEMS_DTO) {
          // this.utilities.log('validating compound items data');
          /*if (field === 'itemType' && typeof row.itemType !== 'object') {
            const aux = row.itemType;
            row.itemType = new Object();
            row.itemType.code = aux;
            row.itemType.name = '';
            row.itemType.description = '';
          }
          if (field === 'uom' && typeof row.uom !== 'object') {
            const aux = row.uom;
            row.uom = new Object();
            row.uom.code = aux;
            row.uom.description = '';
          }*/
          // añadimos campos por defecto
          row.state = 'Active';
        } else if (globalData.selectedType === IMPORTING_TYPES.LOADLOCATIONS_DTO) {
          // this.utilities.log('validating compound locations data');
          /*if (field === 'section' && typeof row.section !== 'object') {
            const aux = row.section;
            row.section = new Object();
            row.section.code = aux;
            row.section.description = '';
            row.section.name = '';
          }*/
        } else if (globalData.selectedType === IMPORTING_TYPES.LOADORDERS_DTO) {
          // this.utilities.log('validating compound orders data');
          // no hay datos compuestos en orders dto
        } else if (globalData.selectedType === IMPORTING_TYPES.LOADPICKS_DTO) {
          // this.utilities.log('validating compound orders data');
          // no hay datos compuestos en loadpicks dto
        } else if (globalData.selectedType === IMPORTING_TYPES.LOADITEMUOMS_DTO) {
          // this.utilities.log('validating compound orders data');
          // no hay datos compuestos en loadpicks dto
        }
      }
    }
    // agregamos/actualizamos el campo indice para poder usarlo en el mat-table.
    row.index = rowIndex;
    batchMapedData.push(row);
    if ((rowIndex + 1 === globalData.data.length) || (batchMapedData.length === globalData.offset)) {
      response = {
        type: 'event',
        message: 'success',
        mapedRowsCounter: rowIndex + 1,
        mapedRowsBatch: batchMapedData
      };
      postMessage(response);
      batchMapedData = [];
    }
  });
  batchMapedData = null;
  globalData = null;
  headers = null;
  close();
}

function validateData() {
  let headers = dataTypesModelMaps[globalData.selectedType];
  let currentRowErrors;
  let dataLength = globalData.data.length;
  if (!headers) {
    postMessage({type: 'error', message: 'headers invalid in validate data', data: {
      map: dataTypesModelMaps[globalData.selectedType],
      type: globalData.selectedType
    }});
    return;
  }
  let batchProcessedData = [];
  globalData.data.forEach((row, rowIndex) => {
    currentRowErrors = [];
    for (const field in headers) {
      if (1) {
        // comprobando campos requeridos
        if (headers[field].required && (row[field] == undefined || row[field] == null || row[field].length === 0)) {
          // this.utilities.log('it is required?');
          const validationError = new Object() as any;
          validationError.index = rowIndex;
          validationError.error = `The field ${headers[field].name} (${field}) is required`;
          // suscriber.next(validationError);
          // this.dataValidationErrors.push(validationError);
          currentRowErrors.push(validationError);
          // this.utilities.error(`There's no exists the field ${field} in the record ${rowIndex}`);
        }
        if (headers[field].min && row[field] < headers[field].min) {
          // this.utilities.log('it is lower than min?');
          const validationError = new Object() as any;
          validationError.index = rowIndex;
          validationError.error = `The field ${headers[field].name} (${field})
            must be greater than ${headers[field].min}`;
          currentRowErrors.push(validationError);
        }
        if (headers[field].max && row[field] > headers[field].max) {
          // this.utilities.log('it is greater than max?');
          const validationError = new Object() as any;
          validationError.index = rowIndex;
          validationError.error = `The field ${headers[field].name} (${field})
            must be lower than ${headers[field].max}`;
          currentRowErrors.push(validationError);
        }
        // comprobando si el campo es unico
        if (headers[field].unique && row[field] !== '') {
          const exists = globalData.data.filter((element, index) => index !== rowIndex && element[field] == row[field]).length;
          if (exists > 0) {
            const validationError = new Object() as any;
            validationError.index = rowIndex;
            validationError.error = `The field ${headers[field].name} (${field})
              must be unique in all the collection. It repits ${exists} times`;
            currentRowErrors.push(validationError);
          }
        }
      }
    }
    if (currentRowErrors.length === 0) {
      row.tooltip = null;
      row.invalid = false;
    } else {
      row.tooltip = currentRowErrors.map((invalidRow, indexInvalidRow) => {
        return invalidRow.error + ((indexInvalidRow < (currentRowErrors.length - 1)) ? ',' : '');
      }).toString();
      row.invalid = true;
    }
    batchProcessedData.push({
      tooltip: row.tooltip,
      invalid: row.invalid,
      index: rowIndex
    });
    if (rowIndex + 1 === globalData.data.length || batchProcessedData.length === globalData.offset) {
      response = {
        type: 'event',
        message: 'success',
        validatedRowsBatch: batchProcessedData,
        processedRowsCounter: rowIndex + 1
      };
      postMessage(response);
      batchProcessedData = [];
    }
  });
  batchProcessedData = null;
  globalData = null;
  headers = null;
  dataLength = null;
  close();
}
