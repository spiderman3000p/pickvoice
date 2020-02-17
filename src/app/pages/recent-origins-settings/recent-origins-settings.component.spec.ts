import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOriginsSettingsComponent } from './recent-origins-settings.component';

describe('RecentOriginsSettingsComponent', () => {
  let component: RecentOriginsSettingsComponent;
  let fixture: ComponentFixture<RecentOriginsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentOriginsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentOriginsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
