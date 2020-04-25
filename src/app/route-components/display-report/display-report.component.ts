import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../../common/models/report';
import { ReportService } from 'src/app/common/services/report.service';


@Component({
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.scss']
})
export class DisplayReportComponent implements OnInit {
  @Input() report: Report;

  date: string;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getReport();
    this.date = this.report.date.toDateString();
  }


  getReport(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    // TODO: change to subscription
    this.report = this.reportService.getReport(id);
  }
}
