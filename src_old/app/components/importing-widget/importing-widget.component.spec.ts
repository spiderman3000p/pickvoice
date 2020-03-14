import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportingWidgetComponent } from './importing-widget.component';

describe('ImportingWidgetComponent', () => {
  let component: ImportingWidgetComponent;
  let fixture: ComponentFixture<ImportingWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportingWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
