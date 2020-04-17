import { Component, OnInit, Input } from '@angular/core';
import { Report } from '../../common/models/report';
import { ReportService } from '../../common/services/report.service';


@Component({
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.scss']
})
export class DisplayReportComponent implements OnInit {
  report: Report;

  date: string;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.report = this.reportService.getReport();
    this.date = this.report.date.toDateString();
  }

}
