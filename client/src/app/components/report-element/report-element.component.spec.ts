import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportElementComponent } from './report-element.component';

describe('ReportElementComponent', () => {
  let component: ReportElementComponent;
  let fixture: ComponentFixture<ReportElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
