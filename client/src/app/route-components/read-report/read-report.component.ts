import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '@app/common/models/report';
import { ReportService } from '@app/common/services/report.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-read-report',
  templateUrl: './read-report.component.html',
  styleUrls: ['./read-report.component.scss']
})
export class ReadReportComponent implements OnInit {
  date: string;
  report: Report;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private spinner: NgxSpinnerService
  ) { }


  async ngOnInit() {
    await this.getReport();
    this.date = this.report.date.toDateString();
  }


  async getReport() {
    this.spinner.show()

    const id = this.route.snapshot.paramMap.get('id');
    this.report = await this.reportService.getReportById(id);

    this.spinner.hide()

    // redirect to 404 if no report with given ID is found
    if (!this.report) {
      this.router.navigateByUrl("/not-found");
    }
  }

}
