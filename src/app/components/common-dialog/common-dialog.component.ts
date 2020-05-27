import { Inject, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss']
})
export class CommonDialogComponent implements OnInit {
  title: string;
  message: string;
  html: string;
  type = 'text';
  positiveBtnText: string;
  negativeBtnText: string;
  positiveBtnCallback: any;
  negativeBtnCallback: any;
  showPositiveBtn: boolean;
  showNegativeBtn: boolean;
  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.negativeBtnCallback = () => {
      this.dialogRef.close(false);
    };
    this.positiveBtnCallback = () => {
      this.dialogRef.close(true);
    };
    this.title = 'Dialog title';
    this.message = 'Dialog message';
    this.positiveBtnText = 'Yes';
    this.negativeBtnText = 'Cancel';
    this.showPositiveBtn = true;
    this.showNegativeBtn = true;
    console.log('date', data);
    if (data.title) {
      this.title = data.title;
    }
    if (data.type) {
      this.type = data.type;
    }
    if (data.html) {
      this.html = data.html;
    }
    if (data.message) {
      this.message = data.message;
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
  }

  positiveBtnClick() {
    this.positiveBtnCallback();
  }

  negativeBtnClick() {
    this.negativeBtnCallback();
  }

  ngOnInit(): void {
  }

}
