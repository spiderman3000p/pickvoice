import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTypeSelectionComponent } from './import-type-selection.component';

describe('ImportTypeSelectionComponent', () => {
  let component: ImportTypeSelectionComponent;
  let fixture: ComponentFixture<ImportTypeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTypeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
