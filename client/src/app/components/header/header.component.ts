import { Component, OnInit } from '@angular/core';
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
    private reportService: ReportService
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
    const response = await this.reportService.uploadReport(files[0]);
    if (response.ok) {
      // route to confirm-report
    } else {
      // route to report-improper-format
    }
  }
}
