import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarUbicacionesComponent } from './importar-ubicaciones.component';

describe('ImportarUbicacionesComponent', () => {
  let component: ImportarUbicacionesComponent;
  let fixture: ComponentFixture<ImportarUbicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarUbicacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarUbicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
