import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOriginsComponent } from './recent-origins.component';

describe('RecentOriginsComponent', () => {
  let component: RecentOriginsComponent;
  let fixture: ComponentFixture<RecentOriginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentOriginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentOriginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
