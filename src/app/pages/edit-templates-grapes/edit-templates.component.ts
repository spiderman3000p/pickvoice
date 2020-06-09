import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ModelMap } from '../../models/model-maps.model';
import { FormControl } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { Observer } from 'rxjs';
import grapesjs from 'grapesjs';

@Component({
  selector: 'app-edit-templates',
  templateUrl: './edit-templates.component.html',
  styleUrls: ['./edit-templates.component.scss']
})
export class EditTemplatesComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoadingResults = false;
  editor: any;
  templateOptions = {
    size: {
      height: 453,
      width: 567
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
  fields = [];
  date = new Date().toLocaleDateString();
  model = ModelMap.InventoryItemMap;
  constructor(private utilities: UtilitiesService) {
    Object.keys(this.model).forEach(key => {
      this.fields.push({
        id: `field-${key}`,
        selected: false,
        key: key,
        label: this.model[key].name,
        value: 'Lorem ipsum dolor',
        disabled: false,
        model: this.model[key],
        iconClass: 'fas fa-database',
        blockType: 'text',
        type: this.model[key].formControl.type
      });
    });
    const barCode = this.utilities.generateBarCode('12345678910');
    console.log('bar code', barCode);
    this.fields.push({
      id: `field-bar-code`,
      selected: false,
      label: 'bar code',
      key: 'barCode',
      value: barCode,
      disabled: false,
      model: null,
      iconClass: 'fas fa-barcode',
      blockType: 'image',
      type: 'image'
    });
    console.log('fields:', this.fields);
  }

  initEditor() {
    this.editor = grapesjs.init({
        container : '#gjs',
        components: '',
        style: '.txt-red{color: red}'
    });
    this.initEditorBlocks();
    this.initEditorPanels();
  }

  initEditorBlocks() {
    // bloque de tablas
    this.editor.BlockManager.add('table-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Table Row</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'table', // Built-in 'table' component
        style: {
          height: '25mm',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });
    // bloque de row de tablas
    /*this.editor.BlockManager.add('row-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Row</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'row', // Built-in 'row' component
        style: {
          height: '12mm',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });*/
    // bloque de columnas
    this.editor.BlockManager.add('cell-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Column</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'cell', // Built-in 'cell' component
        style: {
          height: '11mm',
          width: '33.33%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });
    // bloque de header
    /*this.editor.BlockManager.add('thead-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Table Header</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'thead', // Built-in 'thead' component
        style: {
          height: '12mm',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });
    // bloque de footer
    this.editor.BlockManager.add('tfoot-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Table Footer</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'tfoot', // Built-in 'tfoot' component
        style: {
          height: '12mm',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });
    // bloque de body
    this.editor.BlockManager.add('tbody-block', {
      label: `<div>
      <i class="fas fa-table icon-block"></i>
      <div class="text-block">Table Body</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'tbody', // Built-in 'tbody' component
        style: {
          height: '11mm',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });*/
    // bloque de texto
    this.editor.BlockManager.add('text-block', {
      label: `<div>
      <i class="fas fa-font icon-block"></i>
      <div class="text-block">Text</div>
      </div>`,
      category: 'Structure',
      content: {
        type: 'text', // Built-in 'text' component
        style: {
          height: '16px',
          width: '100%'
        },
        removable: true, // Once inserted it can't be removed
      }
    });
  }

  initEditorPanels() {
    const panelManager = this.editor.Panels;
    panelManager.addButton('options', {
      id: 'undo-button',
      className: 'fa fa-undo',
      command: 'core:undo',
      attributes: { title: 'Undo'},
      active: false,
    });
    panelManager.addButton('options', {
      id: 'redo-button',
      className: 'fa fa-redo',
      command: 'core:redo',
      attributes: { title: 'Redo'},
      active: false,
    });
    panelManager.addButton('options', {
      id: 'clear-button',
      className: 'fa fa-trash',
      command: 'core:canvas-clear',
      attributes: { title: 'Clear All'},
      active: false,
    });
    const button = panelManager.getButton('options', 'sw-visibility');
    console.log('button: ', button);
    console.log('className: ', button.attributes.className);
    button.attributes.className = 'fa fa-square';
    // this.editor.render();
  }

  export() {

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.initEditor();
    // bloques de datos
    let aux;
    this.fields.forEach(field => {
      // this.utilities.log('field a insertar: ', field.label);
      aux = Object.assign({}, {
        label: `<div>
        <i class="${field.iconClass} icon-block"></i>
        <div class="text-block">${field.label}</div>
        </div>`,
        category: 'Data',
        content: {
          components: [{
            type: 'text',
            content: `<strong>${field.label}</strong>`,
            style: {
              height: '16px',
              width: '100%'
            },
          }, {
            type: 'text',
            content: `<span>${field.value}</span>`,
            style: {
              height: '16px',
              width: '100%'
            },
            attributes: {
              id: 'data-' + field.key
            }
          }],
          removable: true, // Once inserted it can't be removed
        }
      });
      if (field.blockType === 'image') {
        aux.content.type = 'image';
        aux.content.attributes = {};
        aux.content.attributes.src = field.value;
        aux.content.attributes.height = '40px';
        aux.content.attributes.width = '100%';
        aux.content.components = [];
      }
      // (igual que texto pero con un id o clase identificadora para sustitui su valor luego)
      this.editor.BlockManager.add(field.id + '-block', aux);
      this.utilities.log('aux insertado: ', aux);
    });
  }
}
