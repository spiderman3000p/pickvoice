import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentActionsComponent } from './current-actions.component';

describe('CurrentActionsComponent', () => {
  let component: CurrentActionsComponent;
  let fixture: ComponentFixture<CurrentActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
