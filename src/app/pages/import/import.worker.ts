/// <reference lib="webworker" />
import { Transport } from '../../models/enums/transport.enum';
import { PickTask } from '../../models/enums/picktask.enum';
import { PickPlanning } from '../../models/enums/pickplanning.enum';
import { Location } from '../../models/enums/location.enum';
import { Item } from '../../models/enums/item.enum';
import { Dock } from '../../models/enums/dock.enum';
/*import { ModelMap, IMPORTING_TYPES } from '../../models/model-maps.model';
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
  let sections;
  const datePattern1 = new RegExp("^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$", 'i'); // dd/mm/yyyy
  const datePattern2 = new RegExp("^([0-9]{2})\-([0-9]{2})\-([0-9]{4})$", 'i'); // dd-mm-yyyy
  const validDatePattern = new RegExp("^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$", 'i'); // yyyy-mm-dd
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
        // verificamos fechas para formatearlas
        sections = null;
        if (headers[field].type === 'date') {
          if (!validDatePattern.test(row[field])) { // si la fecha no es valida
            // intentamos parsearla si tiene alguno de estos formatos: dd-mm-yyyy o dd/mm/yyyy
            if (row[field].includes('/') && datePattern1.test(row[field]) === true) {
              sections = row[field].split('/');
            } else if (row[field].includes('-') && datePattern2.test(row[field]) === true) {
              sections = row[field].split('-');
            }
            // si la fecha cumple con el pattern, la validamos y la parseamos con el formato yyyy-mm-dd
            if (sections) {
              // verificamos que el dia este entre 1 y 31
              if (Number(sections[0]) >= 1 && Number(sections[0]) <= 31 &&
              // verificamos que el mes este entre 1 y 12
              Number(sections[1]) >= 1 && Number(sections[1]) <= 12 && 
              /* verificamos que el anio no tenga mas de 10 anios de antiguedad y que no sea mayor
              a 10 anios en el futuro */
              Number(sections[2]) >= new Date().getFullYear() - 10 && 
              Number(sections[2]) <= new Date().getFullYear() + 10) {
                row[field] = `${sections[2]}-${sections[1]}-${sections[0]}`;
              }
            }
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
          // row.createDate = getDate();
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

function getDate() {
  const date = new Date();
  let month = (date.getMonth() + 1).toString();
  let day  = date.getDate().toString();
  month = month.length === 1 ? '0' + month : month;
  day = day.length === 1 ? '0' + day : day;
  return `${date.getFullYear()}-${month}-${day}`;
}

function validateData() {
  let headers = dataTypesModelMaps[globalData.selectedType];
  const enumTypes = {};
  let currentRowErrors;
  let dataLength = globalData.data.length;
  if (!headers) {
    postMessage({type: 'error', message: 'headers invalid in validate data', data: {
      map: dataTypesModelMaps[globalData.selectedType],
      type: globalData.selectedType
    }});
    return;
  }
  enumTypes[IMPORTING_TYPES.LOCATION_STATE] = Location.LocationStateEnum;
  enumTypes[IMPORTING_TYPES.ITEM_STATE] = Item.StateEnum;
  enumTypes[IMPORTING_TYPES.ITEM_CLASSIFICATIONS] = Item.ClassificationEnum;
  enumTypes[IMPORTING_TYPES.PICK_STATE] = PickPlanning.StateEnum;
  enumTypes[IMPORTING_TYPES.TASK_STATE] = PickTask.TaskStateEnum;
  enumTypes[IMPORTING_TYPES.TRANSPORT_STATE] = Transport.TransportationStatusEnum;
  enumTypes[IMPORTING_TYPES.DOCK_TYPE] = Dock.DockTypeEnum;
  enumTypes[IMPORTING_TYPES.LOCATION_TYPE] = Location.LocationTypeEnum;
  enumTypes[IMPORTING_TYPES.OPERATION_TYPE] = Location.OperationTypeEnum;
  enumTypes[IMPORTING_TYPES.RACK_TYPE] = Location.RackTypeEnum;
  // console.log('enumTypes', enumTypes);
  let batchProcessedData = [];
  let auxIndex;
  let existEnum;
  let sections;
  let validDate: boolean;
  const datePattern1 = new RegExp("^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$", 'i'); // dd/mm/yyyy
  const datePattern2 = new RegExp("^([0-9]{2})\-([0-9]{2})\-([0-9]{4})$", 'i'); // dd-mm-yyyy
  const validDatePattern = new RegExp("^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$", 'i'); // yyyy-mm-dd
  globalData.data.forEach((row, rowIndex) => {
    currentRowErrors = [];
    for (const field in headers) {
      if (1) {
        // comprobando campos requeridos
        if (headers[field].required && headers[field].required === true && (row[field] == undefined || row[field] == null || row[field].length === 0)) {
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
        // verificamos fechas para formatearlas
        sections = null;
        validDate = true;
        if (headers[field].type === 'date') {
          if (!validDatePattern.test(row[field]) && row[field].length > 0) { // si la fecha no es valida
            // intentamos parsearla si tiene alguno de estos formatos: dd-mm-yyyy o dd/mm/yyyy
            if (row[field].includes('/') && datePattern1.test(row[field]) === true) {
              sections = row[field].split('/');
            } else if (row[field].includes('-') && datePattern2.test(row[field]) === true) {
              sections = row[field].split('-');
            }
            // si la fecha cumple con el pattern, la validamos y la parseamos con el formato yyyy-mm-dd
            if (sections) {
              // verificamos que el dia este entre 1 y 31
              if (Number(sections[0]) >= 1 && Number(sections[0]) <= 31 &&
              // verificamos que el mes este entre 1 y 12
              Number(sections[1]) >= 1 && Number(sections[1]) <= 12 && 
              /* verificamos que el anio no tenga mas de 10 anios de antiguedad y que no sea mayor
              a 10 anios en el futuro */
              Number(sections[2]) >= new Date().getFullYear() - 10 && 
              Number(sections[2]) <= new Date().getFullYear() + 10) {
                row[field] = `${sections[2]}-${sections[1]}-${sections[0]}`;
              } else {
                validDate = false;
              }
            } else {
              validDate = false;
            }
          }
          if (!validDate) {
            const validationError = new Object() as any;
            validationError.index = rowIndex;
            validationError.error = `The field ${headers[field].name} is not a valid date`;
            currentRowErrors.push(validationError);
          }
        }

        if (headers[field].formControl.control === 'select' && headers[field].validate === true &&
          enumTypes[headers[field].type] !== undefined) {
          // console.log(`buscando enum type ${headers[field].type} que coincida con ${row[field]}`);
          // console.log(`enumTypes[${headers[field].type}]`, enumTypes[headers[field].type]);
          existEnum = enumTypes[headers[field].type].findIndex(type => {
            auxIndex = headers[field].formControl.valueIndex;
            if (auxIndex === null) {
              if (type === row[field]) {
                return true;
              }
            } else {
              if (type[auxIndex] === row[field]) {
                return true;
              }
            }
            return false;
          });
          if (existEnum === -1) {
            // console.error(`el enum type ${headers[field].type} con valor ${row[field]} no existe`);
            const validationError = new Object() as any;
            validationError.index = rowIndex;
            validationError.error = `The field ${headers[field].name} (${field}) with value ${row[field]}
              does not exists in the available collection: ${enumTypes[headers[field].type].toString()}`;
            currentRowErrors.push(validationError);
          } else {
            // console.log(`el enum type ${headers[field].type} con valor ${row[field]} si existe`);
          }
        } else {
          /* console.log(`el campo ${field} de control ${headers[field].formControl.control} y tipo
          ${headers[field].type} no es un select o no tiene enumType asociado`);
          console.log(`enumType[${headers[field].type}]: `, enumTypes[headers[field].type]);*/
        }
        // comprobando si el campo es unico
        /*if (headers[field].unique && row[field] !== '') {
          const exists = globalData.data.filter((element, index) => index !== rowIndex && element[field] == row[field]).length;
          if (exists > 0) {
            const validationError = new Object() as any;
            validationError.index = rowIndex;
            validationError.error = `The field ${headers[field].name} (${field})
              must be unique in all the collection. It repits ${exists} times`;
            currentRowErrors.push(validationError);
          }
        }*/
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
