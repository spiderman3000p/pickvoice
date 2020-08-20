import { ApplicationRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelMap } from '../../models/model-maps.model';

import { UtilitiesService } from '../../services/utilities.service';
import { DataProviderService } from '../../services/data-provider.service';
import { AuthService } from '../../services/auth.service';
import { OpenTemplateDialogComponent } from '../../components/open-template-dialog/open-template-dialog.component';
import { SaveTemplateDialogComponent } from '../../components/save-template-dialog/save-template-dialog.component';
import { LabelTemplate } from '@pickvoice/pickvoice-api/model/labeltemplate';

import { Observable } from 'rxjs';
import grapesjs from 'grapesjs';
import { AdminTemplatesDialogComponent } from 'src/app/components/admin-templates-dialog/admin-templates-dialog.component';

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
  lpnItemFields = [];
  lpnsFields = [];
  date = new Date().toLocaleDateString();
  templateObject: LabelTemplate = {
    name: 'New Unknow *'
  };
  hasBeenSaved = false;
  lastSavedId: number;
  selectedSaveType: string;
  constructor(private utilities: UtilitiesService, private appRef: ApplicationRef,
              private dialog: MatDialog, private authService: AuthService,
              private dataProvider: DataProviderService) {
    this.lpnItemFields = this.initFields(ModelMap.LpnItemVO2Map);
    this.lpnsFields = this.initFields(ModelMap.LpnVO3Map);
  }

  initFields(model: any): any[] {
    const fields = [];
    Object.keys(model).forEach(key => {
      fields.push({
        id: `field-${key}`,
        selected: false,
        key: key,
        label: model[key].name,
        value: 'Lorem ipsum dolor',
        disabled: false,
        model: model[key],
        iconClass: 'fa fa-cubes',
        blockType: 'text',
        type: model[key].formControl.type
      });
    });
    const barCode = this.utilities.generateBarCode('12345678910');
    console.log('bar code', barCode);
    fields.push({
      id: `field-barcode`,
      selected: false,
      label: 'bar code',
      key: 'barcode',
      value: barCode,
      disabled: false,
      model: null,
      iconClass: 'fa fa-barcode',
      blockType: 'image',
      type: 'image'
    });
    console.log('fields:', fields);
    return fields;
  }



  initEditor() {
    this.editor = grapesjs.init({
        container : '#gjs',
        components: '',
        style: '.txt-red{color: red}',
        storageManager: {
          type: 'custom-remote',
          stepsBeforeSave: 3,
          // For custom parameters/headers on requests
          autoload: false,
          autosave: false
        }
    });
    const that = this;
    this.editor.StorageManager.add('custom-remote', {
      /**
       * Load the data
       * @param  {Array} keys Array containing values to load, eg, ['gjs-components', 'gjs-style', ...]
       * @param  {Function} clb Callback function to call when the load is ended
       * @param  {Function} clbErr Callback function to call in case of errors
       */
      load(keys, clb, clbErr) {
        const obs = new Observable(suscriber => {
          const result = {};
          const template = JSON.parse(that.templateObject.jsonTemplate);
          keys.forEach(key => {
            const value = template[key];
            if (value) {
              result[key] = value;
            }
          });
          suscriber.next(result);
        }).subscribe(result => clb(result), error => clbErr(error));
      },

      /**
       * Store the data
       * @param  {Object} data Data object to store
       * @param  {Function} clb Callback function to call when the load is ended
       * @param  {Function} clbErr Callback function to call in case of errors
       */
      store(data, clb, clbErr) {
        that.utilities.log('data on store: ', data);
        that.templateObject.jsonTemplate = JSON.stringify(data);
        // that.templateObject.jsonTemplate = data['gjs-html'];
        if (that.selectedSaveType === 'new') {
          that.dataProvider.saveTemplate(that.templateObject).subscribe(result => clb(result),
          (error) => clbErr(error));
        } else if (that.selectedSaveType === 'update') {
          that.templateObject.id = that.lastSavedId;
          that.dataProvider.updateTemplate(that.lastSavedId, that.templateObject).subscribe(result => clb(result),
          (error) => clbErr(error));
        }
      }
    });
    this.initEditorBlocks();
    this.initEditorPanels();
  }

  initEditorBlocks() {
    // bloque de tablas
    this.editor.BlockManager.add('table-block', {
      label: `<div>
      <i class="fa fa-table icon-block"></i>
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
      <i class="fa fa-columns icon-block"></i>
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
      <i class="fa fa-font icon-block"></i>
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
    // console.log('panels existentes: ', panelManager.getPanels());
    panelManager.removePanel('devices-c');
    panelManager.addButton('options', {
      id: 'undo-button',
      className: 'fa fa-undo',
      command: 'core:undo',
      attributes: { title: 'Undo'},
      active: false,
    });
    panelManager.addButton('options', {
      id: 'redo-button',
      className: 'fa fa-repeat',
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
    panelManager.addPanel({
      id: 'left-panel',
      visible  : true,
      buttons  : [
        {
          id: 'open-admin-button',
          className: 'fa fa-list-alt',
          attributes: { title: 'Open Templates Admin'},
          active: false,
          command: {
            run: (editor) => {
              this.openTemplateAdmin(editor);
            },
            stop: (editor) => {
              editor.Panels.getButton('left-panel', 'open-admin-button').active = false;
            }
          }
        },
        {
          id: 'open-button',
          className: 'fa fa-folder-open',
          attributes: { title: 'Open Template'},
          active: false,
          command: {
            run: (editor) => {
              this.openTemplate(editor);
            },
            stop: (editor) => {
              editor.Panels.getButton('left-panel', 'open-button').active = false;
            }
          }
        },
        {
          id: 'save-button',
          className: 'fa fa-save',
          attributes: { title: 'Save Template'},
          active: false,
          command: {
            run: (editor) => {
              this.saveLastTemplate(editor);
            },
            stop: (editor) => {
              editor.Panels.getButton('left-panel', 'save-button').active = false;
            }
          }
        },
        {
          id: 'save-new-button',
          className: 'fa fa-file-o',
          attributes: { title: 'Save New Template'},
          active: false,
          command: {
            run: (editor) => {
              this.saveNewTemplate(editor);
            },
            stop: (editor) => {
              editor.Panels.getButton('left-panel', 'save-new-button').active = false;
            }
          }
        }
      ]
    });
  }

  openTemplateAdmin(editor: any) {
    const dialogRef = this.dialog.open(AdminTemplatesDialogComponent, {
      width: '980px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result && result.name && result.description) {
        this.templateObject = new Object(result) as LabelTemplate;
        editor.load((response: any) => {
          this.utilities.log('open response: ', response);
          editor.Panels.getButton('left-panel', 'open-admin-button').active = false;
        }, (error) => {
          editor.Panels.getButton('left-panel', 'open-admin-button').active = false;
          this.utilities.error('Error on loading template', error);
          this.utilities.showSnackBar('Error on loading template', 'OK');
        });
      }
    }, error => {
      this.utilities.error('error after closing open template dialog', error);
      this.utilities.showSnackBar('Error after closing open template', 'OK');
      this.isLoadingResults = false;
    });
  }

  openTemplate(editor: any) {
    const dialogRef = this.dialog.open(OpenTemplateDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result && result.name && result.description) {
        this.templateObject = new Object(result) as LabelTemplate;
        editor.load((response: any) => {
          this.hasBeenSaved = true;
          this.lastSavedId = result.id;
          this.utilities.log('open response: ', response);
          editor.Panels.getButton('left-panel', 'open-button').active = false;
          this.utilities.log('Template successfully loaded');
          this.utilities.showSnackBar('Template successfully loaded', 'OK');
        }, (error) => {
          editor.Panels.getButton('left-panel', 'open-button').active = false;
          this.utilities.error('Error on loading template', error);
          this.utilities.showSnackBar('Error on loading template', 'OK');
        });
      }
    }, error => {
      this.utilities.error('error after closing open template dialog');
      this.utilities.showSnackBar('Error after closing open template', 'OK');
      this.isLoadingResults = false;
    });
  }

  saveLastTemplate(editor: any) {
    if (!(this.hasBeenSaved && this.lastSavedId > 0)) {
      this.saveNewTemplate(editor);
      return;
    }
    this.selectedSaveType = 'update';
    editor.store((response: any) => {
      this.utilities.log('update response: ', response);
      editor.Panels.getButton('left-panel', 'save-button').active = false;
      this.utilities.log('Template successfully updated');
      this.utilities.showSnackBar('Template successfully updated', 'OK');
    }, (error) => {
      editor.Panels.getButton('left-panel', 'save-button').active = false;
      this.utilities.error('Error on updating template', error);
      this.utilities.showSnackBar('Error on updating template', 'OK');
    });
  }

  saveNewTemplate(editor: any) {
    this.selectedSaveType = 'new';
    const dialogRef = this.dialog.open(SaveTemplateDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.utilities.log('dialog result:', result);
      if (result && result.name && result.description) {
        this.templateObject = new Object(result) as LabelTemplate;
        this.templateObject.ownerId = this.authService.getOwnerId();
        this.templateObject.depotId = this.authService.getDepotId();
        this.templateObject.dataSet = '';
        editor.store((response: any) => {
          this.hasBeenSaved = true;
          this.lastSavedId = response.id;
          this.utilities.log('save response: ', response);
          editor.Panels.getButton('left-panel', 'save-new-button').active = false;
          this.utilities.log('Template successfully saved');
          this.utilities.showSnackBar('Template successfully saved', 'OK');
        }, (error) => {
          editor.Panels.getButton('left-panel', 'save-new-button').active = false;
          this.utilities.error('Error on saving template', error);
          this.utilities.showSnackBar('Error on saving template', 'OK');
        });
      }
    }, error => {
      this.utilities.error('error after closing save template dialog');
      this.utilities.showSnackBar('Error after closing save template', 'OK');
      this.isLoadingResults = false;
    });
  }

  export() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  createBlock(fields: any[] = [], title: string = 'Data') {
    let aux;
    fields.forEach(field => {
      // this.utilities.log('field a insertar: ', field.label);
      aux = Object.assign({}, {
        label: `<div>
        <i class="${field.iconClass} icon-block"></i>
        <div class="text-block">${field.label}</div>
        </div>`,
        category: title,
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
      if (field.blockType === 'image' && field.key === 'barcode') {
        aux.content.type = 'image';
        aux.content.attributes = {};
        aux.content.attributes.id = 'data-' + field.key;
        aux.content.attributes.src = field.value;
        aux.content.attributes.height = '70px';
        aux.content.attributes.width = '100%';
        aux.content.components = [];
      }
      // (igual que texto pero con un id o clase identificadora para sustitui su valor luego)
      this.editor.BlockManager.add(field.id + '-block', aux);
      // this.utilities.log('aux insertado: ', aux);
    });
  }

  ngAfterViewInit() {
    this.initEditor();
    // bloques de datos
    this.createBlock(this.lpnsFields, 'LPN Data');
    this.createBlock(this.lpnItemFields, 'LPN Item Data');
  }
}
