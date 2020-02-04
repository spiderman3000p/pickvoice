import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRowDialogComponent } from './edit-row-dialog.component';

describe('EditRowDialogComponent', () => {
  let component: EditRowDialogComponent;
  let fixture: ComponentFixture<EditRowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRowDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
