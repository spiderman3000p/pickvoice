import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ModelMap } from '../../models/model-maps.model';
import { FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { Observer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../../components/preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-edit-templates',
  templateUrl: './edit-templates.component.html',
  styleUrls: ['./edit-templates.component.scss']
})
export class EditTemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  templateOptions = {
    size: {
      height: 472,
      width: 591
    },
    paddings: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    },
    border: {
      width: 0,
      style: 'solid'
    },
    row: {
      paddings: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      border: {
        width: 0,
        style: 'solid'
      }
    },
    date: {
      position: 'top-right',
      paddings: {
        left: 5,
        top: 5,
        right: 5,
        bottom: 5
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      border: {
        width: 0,
        style: 'solid'
      }
    },
    field: {
      height: 48,
      fontSize: 11,
      border: {
        width: 0,
        style: 'solid'
      },
      paddings: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      label: {
        align: 'left',
        fontSize: 11,
        fontWeight: 900,
        margins: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        paddings: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        border: {
          width: 0,
          style: 'solid'
        },
      },
      value: {
        align: 'left',
        fontSize: 11,
        fontWeight: 400,
        margins: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        paddings: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        border: {
          width: 0,
          style: 'solid'
        }
      },
    },
    dropzone: {
      paddings: {
        left: 5,
        top: 5,
        right: 5,
        bottom: 5
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    }
  };
  date = new Date().toLocaleDateString();
  templateStyle = {};
  rowStyle = {};
  dropzoneStyle = {};
  fieldStyle = {};
  fieldLabelStyle = {};
  fieldValueStyle = {};
  dateStyle = {};
  defaultFields = [];
  selectedFields = [];
  fieldSelector = new FormControl('');
  fields = [];
  draggingElement: Node;
  rows = [ // por defecto: matriz de 3x3
    { //  fila 1
      selectedColumns: {
        icon: 'fas fa-columns',
        label: '3 columns'
      },
      columns: [
        { // columna 1
          id: 'column-1',
          class: 'col',
          content: null
        },
        { // columna 2
          id: 'column-2',
          class: 'col',
          content: null
        },
        { // columna 3
          id: 'column-3',
          class: 'col',
          content: null
        }
      ]
    },
    {
      selectedColumns: {
        icon: 'fas fa-columns',
        label: '3 columns'
      },
      columns: [// fila 2
        { // columna 1
          id: 'column-4',
          class: 'col',
          content: null
        },
        { // columna 2
          id: 'column-5',
          class: 'col',
          content: null
        },
        { // columna 3
          id: 'column-6',
          class: 'col',
          content: null
        }
      ]
    },
    {
      selectedColumns: {
        icon: 'fas fa-columns',
        label: '3 columns'
      },
      columns: [// fila 3
        { // columna 1
          id: 'column-7',
          class: 'col',
          content: null
        },
        { // columna 2
          id: 'column-8',
          class: 'col',
          content: null
        },
        { // columna 3
          id: 'column-9',
          class: 'col',
          content: null
        }
      ]
    }
  ]; // placeholders
  model = ModelMap.InventoryItemMap;
  constructor(private utilities: UtilitiesService, private dialog: MatDialog) {
    Object.keys(this.model).forEach(key => {
      this.fields.push({
        id: `field-${key}`,
        selected: false,
        label: this.model[key].name,
        value: 'Lorem ipsum dolor',
        disabled: false,
        model: this.model[key],
        type: this.model[key].formControl.type
      });
    });
    const barCode = this.utilities.generateBarCode('12345678910');
    console.log('bar code', barCode);
    this.fields.push({
      id: `field-bar-code`,
      selected: false,
      label: 'bar code',
      value: barCode,
      disabled: false,
      model: null,
      type: 'image'
    });
    this.defaultFields = this.fields.slice();
    this.fieldSelector.patchValue(this.fields[0]);
    this.getAllStyles();
  }

  addNewRow() {
    const newRow = {
      selectedColumns: {
        icon: 'fas fa-columns',
        label: '3 columns'
      },
      columns: [// fila 3
        { // columna 1
          id: `column-${new Date().getTime()}1`,
          class: 'col',
          content: null
        },
        { // columna 2
          id: `column-${new Date().getTime()}2`,
          class: 'col',
          content: null
        },
        { // columna 3
          id: `column-${new Date().getTime()}3`,
          class: 'col',
          content: null
        }
      ]
    };
    this.rows.push(newRow);
  }

  addNewColumn(rowIndex: number) {
    const newColumn = {
      id: `column-${new Date().getTime()}`,
      class: 'col',
      content: null
    };
    this.rows[rowIndex].columns.push(newColumn);
  }

  removeRow(rowIndex: number) {
    this.rows.splice(rowIndex, 1);
  }

  removeColumn(rowIndex: number, columnIndex: number) {
    this.rows[rowIndex].columns.splice(columnIndex, 1);
  }

  getAllStyles() {
    this.templateStyle = this.getTemplateStyle();
    this.rowStyle = this.getRowStyle();
    this.dropzoneStyle = this.getDropzoneStyle();
    this.fieldStyle = this.getFieldStyle();
    this.fieldLabelStyle = this.getFieldLabelStyle();
    this.fieldValueStyle = this.getFieldValueStyle();
    this.dateStyle = this.getDateStyle();
  }

  getTemplateStyle() {
    return {
      'padding-left': `${this.templateOptions.paddings.left}px`,
      'padding-right': `${this.templateOptions.paddings.right}px`,
      'padding-top': `${this.templateOptions.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.paddings.bottom}px`,
      border: `${this.templateOptions.border.width}px ${this.templateOptions.border.style}`,
      height: `${this.templateOptions.size.height}px`,
      width: `${this.templateOptions.size.width}px`
    };
  }

  getDateStyle() {
    return {
      'padding-left': `${this.templateOptions.date.paddings.left}`,
      'padding-right': `${this.templateOptions.date.paddings.right}`,
      'padding-top': `${this.templateOptions.date.paddings.top}`,
      'padding-bottom': `${this.templateOptions.date.paddings.bottom}`,
      'margin-left': `${this.templateOptions.date.margins.left}`,
      'margin-right': `${this.templateOptions.date.margins.right}`,
      'margin-top': `${this.templateOptions.date.margins.top}`,
      'margin-bottom': `${this.templateOptions.date.margins.bottom}`,
      border: `${this.templateOptions.date.border.width}px ${this.templateOptions.date.border.style}`,
      position: 'absolute',
      top: `${this.templateOptions.date.position === 'top-left' ||
      this.templateOptions.date.position === 'top-right' ?
      this.templateOptions.date.margins.top + 'px' : 'unset'}`,
      left: `${this.templateOptions.date.position === 'top-left' ||
      this.templateOptions.date.position === 'bottom-left' ?
      this.templateOptions.date.margins.left + 'px' : 'unset'}`,
      bottom: `${this.templateOptions.date.position === 'bottom-left' ||
      this.templateOptions.date.position === 'bottom-right' ?
      this.templateOptions.date.margins.bottom + 'px' : 'unset'}`,
      right: `${this.templateOptions.date.position === 'top-right' ||
      this.templateOptions.date.position === 'bottom-right' ?
      this.templateOptions.date.margins.right + 'px' : 'unset'}`,
    };
  }

  getRowStyle() {
    return {
      'padding-left': `${this.templateOptions.row.paddings.left}px`,
      'padding-right': `${this.templateOptions.row.paddings.right}px`,
      'padding-top': `${this.templateOptions.row.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.row.paddings.bottom}px`,
      'margin-left': `${this.templateOptions.row.margins.left}px`,
      'margin-right': `${this.templateOptions.row.margins.right}px`,
      'margin-top': `${this.templateOptions.row.margins.top}px`,
      'margin-bottom': `${this.templateOptions.row.margins.bottom}px`,
      border: `${this.templateOptions.row.border.width}px ${this.templateOptions.row.border.style}`,
    };
  }

  getDropzoneStyle() {
    return {
      'padding-left': `${this.templateOptions.dropzone.paddings.left}px`,
      'padding-right': `${this.templateOptions.dropzone.paddings.right}px`,
      'padding-top': `${this.templateOptions.dropzone.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.dropzone.paddings.bottom}px`
    };
  }

  getFieldStyle() {
    return {
      'padding-left': `${this.templateOptions.field.paddings.left}px`,
      'padding-right': `${this.templateOptions.field.paddings.right}px`,
      'padding-top': `${this.templateOptions.field.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.field.paddings.bottom}px`,
      'margin-left': `${this.templateOptions.field.margins.left}px`,
      'margin-right': `${this.templateOptions.field.margins.right}px`,
      'margin-top': `${this.templateOptions.field.margins.top}px`,
      'margin-bottom': `${this.templateOptions.field.margins.bottom}px`,
      border: `${this.templateOptions.field.border.width}px ${this.templateOptions.field.border.style}`,
    };
  }

  getFieldLabelStyle() {
    return {
      'padding-left': `${this.templateOptions.field.label.paddings.left}px`,
      'padding-right': `${this.templateOptions.field.label.paddings.right}px`,
      'padding-top': `${this.templateOptions.field.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.field.paddings.bottom}px`,
      'margin-left': `${this.templateOptions.field.label.margins.left}px`,
      'margin-right': `${this.templateOptions.field.label.margins.right}px`,
      'margin-top': `${this.templateOptions.field.margins.top}px`,
      'margin-bottom': `${this.templateOptions.field.margins.bottom}px`,
      border: `${this.templateOptions.field.label.border.width}px ${this.templateOptions.field.label.border.style}`
    };
  }

  getFieldValueStyle() {
    return {
      'padding-left': `${this.templateOptions.field.value.paddings.left}px`,
      'padding-right': `${this.templateOptions.field.value.paddings.right}px`,
      'padding-top': `${this.templateOptions.field.value.paddings.top}px`,
      'padding-bottom': `${this.templateOptions.field.value.paddings.bottom}px`,
      'margin-left': `${this.templateOptions.field.value.margins.left}px`,
      'margin-right': `${this.templateOptions.field.value.margins.right}px`,
      'margin-top': `${this.templateOptions.field.value.margins.top}px`,
      'margin-bottom': `${this.templateOptions.field.value.margins.bottom}px`,
      border: `${this.templateOptions.field.value.border.width}px ${this.templateOptions.field.value.border.style}`
    };
  }

  pushSelectedField() {
    // console.log('selected field', this.fieldSelector.value);
    let indexAux;
    const existentIndex = this.rows.findIndex(row => {
      indexAux = row.columns.findIndex(field => field.content && field.content.id === this.fieldSelector.value.id);
      if (indexAux > -1) {
        return true;
      }
      return false;
    });
    if (existentIndex === -1) {
      // console.log('inserting field');
      let dropzone;
      // buscamos el primer lugar vacio
      this.rows.findIndex(row => {
        indexAux = row.columns.findIndex(field => field.content === null);
        if (indexAux > -1) {
          dropzone = row.columns[indexAux];
          return true;
        }
        return false;
      });
      if (dropzone) {
        dropzone.content = this.fieldSelector.value;
        const index2 = this.fields.findIndex(field => field.id === this.fieldSelector.value.id);
        if (index2 > -1) {
          this.fields.splice(index2, 1);
        }
      } else {
        console.error('No hay espacios disponibles en el template');
      }
    }
  }

  onDragOverDropzone(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('dropzone')) {
      target.classList.add('drop-target');
    }
    // console.log('dropzone drag over event target: ', target);
    event.preventDefault();
  }

  onDragLeaveDropzone(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('dropzone')) {
      target.classList.remove('drop-target');
    }
    // console.log('dropzone drag leave event target: ', target);
  }

  onDragEndDropzone(event: Event) {
    const target = event.target as HTMLElement;
    target.classList.remove('drag-field-holding');
    if (target.classList.contains('dropzone')) {
      target.classList.remove('drop-target');
    }
    // this.draggingElement = null;
    // console.log('dropzone drag end event target: ', target);
  }

  onDropDropzone(event: any) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('dropzone')) {
      target.classList.remove('drop-target');
    }
    // console.log('on drop target: ', target);
    const elementId = event.dataTransfer.getData('text');
    console.log('element id: ', elementId);
    const element = document.getElementById(elementId);
    console.log('element: ', element);
    const oldRowIndex = element.getAttribute('data-rowIndex');
    const oldColumnIndex = element.getAttribute('data-columnIndex');
    /*console.log('element: ', element);
    console.log(`oldRowIndex: ${oldRowIndex} - olColumnIndex: ${oldColumnIndex}`);*/
    target.appendChild(element);
    const newRowIndex = target.getAttribute('data-rowIndex');
    const newColumnIndex = target.getAttribute('data-columnIndex');
    element.setAttribute('data-rowIndex', newRowIndex);
    element.setAttribute('data-columnIndex', newColumnIndex);
    element.classList.remove('drag-field-holding');
    const aux = Object.assign({}, this.rows[oldRowIndex].columns[oldColumnIndex].content);
    this.rows[oldRowIndex].columns[oldColumnIndex].content = null;
    this.rows[newRowIndex].columns[newColumnIndex].content = aux;
    // this.draggingElement.parentNode.removeChild(this.draggingElement);
    // console.log('dropzone drop event target finished: ', target);
    event.preventDefault();
  }

  onFieldDragStart(event: any) {
    const target = event.target as HTMLElement;
    target.classList.add('drag-field-holding');
    this.draggingElement = target;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text', target.id);
    console.log('field drag start event target: ', target);
  }

  onFieldDragEnd(event: Event) {
    const target = event.target as HTMLElement;
    target.classList.remove('drag-field-holding');
    // console.log('field drag end event target: ', target);
  }

  updateTemplateStyles() {
    this.getAllStyles();
  }

  onInputNumber(evt: KeyboardEvent) {
    // console.log('keyDown', evt);
    const charCode = evt.keyCode;
    // izquierda, derecha, delete y suprimir
    if (charCode === 8 || charCode === 37 || charCode === 39 || charCode === 46 || charCode === 9) {
      return true;
    }
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
      return true;
    }
    return false;
  }

  preview() {
    const printable = document.createElement('div');
    printable.classList.add('printable');
    const template = document.getElementById('template').cloneNode(true);
    printable.appendChild(template);
    const w = window.open();
    w.document.write('<html><head><title>Print it!</title>');
    w.document.write('<link rel="stylesheet" type="text/css" href="../src/pages/edit-templates/' +
    'edit-templates.component.scss"></head><body>');
    w.document.write(printable.innerHTML);
    w.document.write('</body></html>');
  }

  preview2() {
    const printable = document.createElement('div');
    printable.classList.add('printable');
    const template = document.querySelector('.template-container').cloneNode(true);
    printable.appendChild(template);
    const settings = {
      options: this.templateOptions,
      data: this.rows
    };
    const observer = {
      next: (result) => {
      },
      error: (error) => {
      }
    } as Observer<boolean>;
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      data: {
        title: 'Template Preview',
        settings: settings,
        templateStyle: this.templateStyle,
        rowStyle: this.rowStyle,
        dropzoneStyle: this.dropzoneStyle,
        fieldStyle: this.fieldStyle,
        fieldLabelStyle: this.fieldLabelStyle,
        fieldValueStyle: this.fieldValueStyle,
        dateStyle: this.dateStyle
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result) {

      }
    }, error => {
      this.utilities.error('error after closing edit row dialog');
      this.utilities.showSnackBar('Error after closing edit dialog', 'OK');
    });
  }

  print() {
    const printable = document.createElement('div');
    printable.classList.add('printable');
    const template = document.getElementById('template').cloneNode(true);
    printable.appendChild(template);
    const w = window.open();
    w.document.write(printable.innerHTML);
    w.print();
    w.close();
  }

  saveSettings() {
    const settings = {
      options: this.templateOptions,
      data: this.rows
    };
    localStorage.setItem('lpnsSettings', JSON.stringify(settings));
    console.log('template guardado');
    this.utilities.showSnackBar('Template saved', 'OK');
  }

  loadSettings() {
    let settings;
    if (localStorage.getItem('lpnsSettings')) {
      settings = JSON.parse(localStorage.getItem('lpnsSettings'));
      this.templateOptions = settings.options;
      this.rows = settings.data;
      this.utilities.showSnackBar('Last template loaded', 'OK');
    } else {
      console.log('No hay data de template guardada');
      this.utilities.showSnackBar('No previous template found', 'OK');
    }
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy() {
    this.saveSettings();
  }

  ngAfterViewInit() {
  }
}
