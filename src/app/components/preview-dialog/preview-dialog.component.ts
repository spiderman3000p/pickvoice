import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ModelMap } from '../../models/model-maps.model';
import { UtilitiesService } from '../../services/utilities.service';

import bootstrapStyleCss from 'node_modules/bootstrap/dist/css/bootstrap.css';
import previewStyleCss from './preview-dialog.component.scss';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {
  title: string;
  message: string;
  positiveBtnText: string;
  negativeBtnText: string;
  positiveBtnCallback: any;
  negativeBtnCallback: any;
  showPositiveBtn: boolean;
  showNegativeBtn: boolean;
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
        left: 5,
        top: 5,
        right: 5,
        bottom: 5
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 5
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
        bottom: 5
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
        bottom: 5
      },
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 5
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
        bottom: 5
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
  constructor(public dialogRef: MatDialogRef<PreviewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    this.negativeBtnCallback = () => {
      this.dialogRef.close(false);
    };
    this.positiveBtnCallback = () => {
      this.dialogRef.close(true);
    };
    this.title = 'Dialog title';
    this.message = 'Dialog message';
    this.positiveBtnText = 'Print';
    this.negativeBtnText = 'Cancel';
    this.showPositiveBtn = true;
    this.showNegativeBtn = true;
    if (data.title) {
      this.title = data.title;
    }
    if (data.settings) {
      this.rows = data.settings.data;
      this.templateOptions = data.settings.options;
    }
    if (data.templateStyle) {
      this.templateStyle = data.templateStyle;
    }
    if (data.rowStyle) {
      this.rowStyle = data.rowStyle;
    }
    if (data.dropzoneStyle) {
      this.dropzoneStyle = data.dropzoneStyle;
    }
    if (data.fieldStyle) {
      this.fieldStyle = data.fieldStyle;
    }
    if (data.fieldLabelStyle) {
      this.fieldLabelStyle = data.fieldLabelStyle;
    }
    if (data.fieldValueStyle) {
      this.fieldValueStyle = data.fieldValueStyle;
    }
    if (data.dateStyle) {
      this.dateStyle = data.dateStyle;
    }
    if (data.positiveBtnText) {
      this.positiveBtnText = data.positiveBtnText;
    }
    if (data.negativeBtnText) {
      this.negativeBtnText = data.negativeBtnText;
    }
    if (data.positiveBtnCallback) {
      this.positiveBtnCallback = data.positiveBtnCallback;
    }
    if (data.negativeBtnCallback) {
      this.negativeBtnCallback = data.negativeBtnCallback;
    }
    console.log('data: ', data);
  }

  print() {
    const printable = document.createElement('div');
    printable.classList.add('printable');
    const template = document.getElementById('template-preview').cloneNode(true);
    printable.appendChild(template);
    console.log('bootstrap styles: ', bootstrapStyleCss);
    console.log('preview styles: ', previewStyleCss);
    const w = window.open();
    w.document.write('<html><head><title>Template Preview</title>');
    w.document.write('<style>' +
    bootstrapStyleCss + previewStyleCss +
    '</style></head><body>');
    w.document.write(printable.innerHTML);
    w.document.write('</body></html>');
    w.print();
    w.close();
  }

  positiveBtnClick() {
    // this.positiveBtnCallback();
    this.print();
  }

  negativeBtnClick() {
    this.negativeBtnCallback();
  }

  ngOnInit(): void {
  }

}
