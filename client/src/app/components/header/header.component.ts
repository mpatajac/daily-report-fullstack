import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from '@app/common/models/report';
import { MessengerService } from '@app/common/services/messenger.service';
import { ReportService } from '@app/common/services/report.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private messenger: MessengerService,
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  toTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  toggleReportDropdown() {
    const dropdown = document.getElementsByClassName("new-report-dropdown")[0];
    dropdown.classList.toggle("show");
  }

  hideReportDropdown() {
    const dropdown = document.getElementsByClassName("new-report-dropdown")[0];
    dropdown.classList.remove("show");
  }

  async uploadReport(files: FileList) {
    // TODO: add spinner

    const response = await this.reportService.uploadReport(files[0]);
    if (response.ok) {
      // TODO: remove this, get report from response
      const dummyReport = new Report("matija", "Test", ["abcabc"], [], [], []);

			localStorage.setItem("uploadedReport", JSON.stringify(dummyReport));
      this.router.navigateByUrl("app/confirm");
    } else {
      // route to report-improper-format
    }
  }
}
