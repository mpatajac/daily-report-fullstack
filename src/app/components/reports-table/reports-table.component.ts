import { Component, OnInit } from '@angular/core';
import { User } from "../../common/models/user";
import { Report } from '../../common/models/report';
import { ReportService } from '../../common/services/report.service';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {
  showSearchAndFilterFields: boolean = false;
  reports: Report[];

  selectedOption: string;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.reports = this.reportService.getReports();

    this.selectedOption = "all";
  }

  isSelectedOption(option: string): boolean {
    return option === this.selectedOption;
  }

  selectDropdownOption(option: string) {
    this.selectedOption = option;
  }
}
