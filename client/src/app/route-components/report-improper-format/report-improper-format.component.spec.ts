import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportImproperFormatComponent } from './report-improper-format.component';

describe('ReportImproperFormatComponent', () => {
  let component: ReportImproperFormatComponent;
  let fixture: ComponentFixture<ReportImproperFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportImproperFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportImproperFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
