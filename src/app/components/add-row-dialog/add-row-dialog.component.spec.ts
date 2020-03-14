import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRowDialogComponent } from './add-row-dialog.component';

describe('AddRowDialogComponent', () => {
  let component: AddRowDialogComponent;
  let fixture: ComponentFixture<AddRowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRowDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
