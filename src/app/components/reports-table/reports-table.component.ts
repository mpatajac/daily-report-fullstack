import { Component, OnInit } from '@angular/core';
import { Report } from '../../common/models/report';
import { Column, SortOrder, SortOptions } from '../../common/models/sort'
import { ReportService } from '../../common/services/report.service';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {
  showSAF: boolean;
  reports: Report[];

  startDate: Date;
  endDate: Date;
  sortConfiguration: SortOptions;
  filterConfiguration: any;

  constructor(
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.showSAF = false;

    // Initially, display reports from newest to oldest
    this.sortConfiguration = {
      column: Column.Date,
      order: SortOrder.Desc
    } as SortOptions;

    const filterConfig = JSON.parse(localStorage.getItem("filterConfig"));
    if (filterConfig) {
      this.filterConfiguration = filterConfig;
    } else {
      this.initializeFilterConfiguration();
    }

    await this.updateDisplayedReports(true);
  }

  toggleSAFVisibility() {
    this.showSAF = !this.showSAF;
  }

  // set filterConfiguration to its base values
  initializeFilterConfiguration() {
    this.filterConfiguration = {
      generalSearch: undefined,
      searchByTitle: undefined,
      searchByUser: undefined,
      startDate: undefined,
      endDate: undefined,
      problems: "all",
      sort: this.sortConfiguration
    };
  }

  isSelectedOption(option: string): boolean {
    return option === this.filterConfiguration.problems;
  }

  async updateDisplayedReports(force: boolean = false) {
    // localStorage contains last queried/saved configuration
    // only update if something changed
    // TODO: find better way to compare objects (LoDash?)
    if (localStorage.getItem("filterConfig") !== JSON.stringify(this.filterConfiguration) || force) {
      this.reportService.resetPage();
      await this.getReports();

      localStorage.setItem("filterConfig", JSON.stringify(this.filterConfiguration));
    }
  }

  async selectDropdownOption(option: string) {
    this.filterConfiguration.problems = option;
    await this.updateDisplayedReports();
  }

  async configureSort(column: string) {
    this.updateTableHeader(column);

    // same column -> change sort order
    if (column === this.sortConfiguration.column) {
      this.sortConfiguration.order === SortOrder.Asc ?
        this.sortConfiguration.order = SortOrder.Desc :
        this.sortConfiguration.order = SortOrder.Asc;
    } else {
      // username and report title start as ascending, date as descending
      switch (column) {
        case "title":
          this.sortConfiguration.column = Column.Title;
          this.sortConfiguration.order = SortOrder.Asc;
          break;

        case "user":
          this.sortConfiguration.column = Column.User;
          this.sortConfiguration.order = SortOrder.Asc;
          break;

        case "date":
          this.sortConfiguration.column = Column.Date;
          this.sortConfiguration.order = SortOrder.Desc;
          break;

        default:
          console.error("Invalid column value.");
      }
    }

    this.filterConfiguration.sort = this.sortConfiguration;
    await this.updateDisplayedReports();
  }

  async updateStartDate() {
    this.filterConfiguration.startDate = new Date(this.startDate).toJSON();
    await this.updateDisplayedReports();
  }

  async updateEndDate() {
    let date = new Date(this.endDate);

    // use day after set date (to include reports submitted on that day)
    date.setDate(date.getDate() + 1);
    this.filterConfiguration.endDate = date.toJSON();
    await this.updateDisplayedReports();
  }

  async resetFilter() {
    this.initializeFilterConfiguration();

    this.showSAF = false;
    this.startDate = undefined;
    this.endDate = undefined;
    localStorage.removeItem("filterConfig");
    
    await this.updateDisplayedReports();
  }

  async getReports() {
    this.spinner.show();

    let newReports = await this.reportService.getReports(this.filterConfiguration);
    if (this.reportService.page === 1) {
      this.reports = newReports;
    } else {
      this.reports = this.reports.concat(newReports);
    }

    this.spinner.hide();
  }

  async moreReports() {
    this.reportService.nextPage();
    this.getReports();
  }

  existRemainingReports(): boolean {
    return this.reports?.length < this.reportService.totalReports;
  }

  /** update DOM */
  updateTableHeader(column: string) {
    const oldHeader = document.getElementById('header-' + this.sortConfiguration.column);

    if (column === this.sortConfiguration.column) {
      oldHeader.classList.toggle("asc");
      oldHeader.classList.toggle("desc");
    } else {
      oldHeader.classList.remove(this.sortConfiguration.order);

      const newHeader = document.getElementById('header-' + column);
      if (column === "date") {
        newHeader.classList.add("desc");
      } else {
        newHeader.classList.add("asc");
      }
    }
  }

  /**
   * Determine if some of the filter parameters is altered.
   * Used to decide if search-and-filter header should be displayed.
   */
  isFilterUsed(): boolean {
    return [
      this.filterConfiguration.generalSearch,
      this.filterConfiguration.searchByTitle,
      this.filterConfiguration.searchByUser,
      this.filterConfiguration.startDate,
      this.filterConfiguration.endDate
    ].some(this.isAltered) ||
      this.filterConfiguration.problems !== "all";
  }

  isAltered(element: string | Date): boolean {
    return !(
      element === undefined || (
        typeof element === "string" ?
          element.length === 0 :
          false
      )
    );
  }

  openReport(report: Report) {
    // save SAF settings
    localStorage.setItem(
      "filterConfig",
      JSON.stringify(this.filterConfiguration)
    );

    const baseUrl = "/app/report";
    this.router.navigateByUrl(`${baseUrl}/${report.id}`);
  }
}
