import { Inject, Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-row-dialog',
  templateUrl: './edit-row-dialog.component.html',
  styleUrls: ['./edit-row-dialog.component.scss']
})

export class EditRowDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle = '';
  fields: any[];
  keys: string[];
  isLoadingResults = false;
  constructor(public dialogRef: MatDialogRef<EditRowDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private utilities: UtilitiesService) {
    const row = data.row; // object
    console.log('row recibida', row);
    this.fields = data.map as any; // map of object
    console.log('fields', this.fields);
    const formControls = {};
    this.keys = Object.keys(this.fields);
    console.log('keys', this.keys);
    let value = '';
    this.keys.forEach((key, index) => {
      /* value = this.utilities.renderColumnData(this.fields[key].type, row[key]);
      if (this.fields[key].type === 'date') {
        console.log('valor de fecha en dialogo editar', value);
      }*/
      value = row[key];
      if (this.fields[key].required) {
        formControls[key] = new FormControl(value, Validators.required);
      } else {
        formControls[key] = new FormControl(value);
      }
    });
    this.dialogTitle = 'Edit Row';
    console.log('titulo de dialogo', this.dialogTitle);
    this.form = new FormGroup(formControls);
    console.log('edit form', this.form);
  }

  onSubmit() {
    console.log('data to return', this.form.value);
    this.dialogRef.close(this.form.value);
  }

  ngOnInit(): void {
  }

}
