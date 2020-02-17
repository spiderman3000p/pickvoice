import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarItemsComponent } from './importar-items.component';

describe('ImportarItemsComponent', () => {
  let component: ImportarItemsComponent;
  let fixture: ComponentFixture<ImportarItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
