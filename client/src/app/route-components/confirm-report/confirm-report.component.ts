import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from '@app/common/models/report';
import { ReportService } from '@app/common/services/report.service';

@Component({
  selector: 'app-confirm-report',
  templateUrl: './confirm-report.component.html',
  styleUrls: ['./confirm-report.component.scss']
})
export class ConfirmReportComponent implements OnInit {
	report: Report;
	date: string;

  constructor(
		private router: Router,
		private reportService: ReportService
	) { }

  ngOnInit(): void {
		this.report = JSON.parse(localStorage.uploadedReport) as Report;
		this.report.date = new Date(this.report.date);
		this.date = this.report.date.toDateString();
  }

	confirmReport() {
		this.reportService.addReport(this.report);
		this.router.navigateByUrl("/app/dashboard");
	}

}
