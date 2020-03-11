import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReportComponent } from './display-report.component';

describe('DisplayReportComponent', () => {
  let component: DisplayReportComponent;
  let fixture: ComponentFixture<DisplayReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
