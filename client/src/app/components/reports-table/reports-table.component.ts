import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { Report } from '@app/common/models/report';
import { ReportService } from '@app/common/services/report.service';
import { Column, SortOptions, SortOrder } from '@app/common/models/sort';

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

  filterConfiguration: any;

  constructor(
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  async ngOnInit() {
    const filterConfig = JSON.parse(localStorage.getItem("filterConfig"));
    if (filterConfig) {
      this.filterConfiguration = filterConfig;
    } else {
      this.initializeFilterConfiguration();
    }

    await this.updateDisplayedReports(true);
		this.updateTableHeader();

		// use setTimeout to let everything load first
		setTimeout(
			_ => {
				if (localStorage.showSAF) {
					this.showSAF = JSON.parse(localStorage.showSAF);

					// we don't need it after everything has loaded
					localStorage.removeItem("showSAF");
				} else {
					this.showSAF = false;
				}
				
			}
		, 0);
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

			// Initially, display reports from newest to oldest
			sort: {
				column: Column.Date,
				order: SortOrder.Desc
			} as SortOptions
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
    // same column -> change sort order
    if (column === this.filterConfiguration.sort.column) {
      this.filterConfiguration.sort.order === SortOrder.Asc ?
        this.filterConfiguration.sort.order = SortOrder.Desc :
        this.filterConfiguration.sort.order = SortOrder.Asc;
    } else {
      // username and report title start as ascending, date as descending
      switch (column) {
        case "title":
          this.filterConfiguration.sort.column = Column.Title;
          this.filterConfiguration.sort.order = SortOrder.Asc;
          break;

        case "user":
          this.filterConfiguration.sort.column = Column.User;
          this.filterConfiguration.sort.order = SortOrder.Asc;
          break;

        case "date":
          this.filterConfiguration.sort.column = Column.Date;
          this.filterConfiguration.sort.order = SortOrder.Desc;
          break;

        default:
          console.error("Invalid column value.");
      }
    }

    await this.updateDisplayedReports();
		this.updateTableHeader();
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

    this.startDate = undefined;
    this.endDate = undefined;
    localStorage.removeItem("filterConfig");
    
    await this.updateDisplayedReports();
		this.updateTableHeader();
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
  updateTableHeader() {
		// use setTimeout to delay process in the event loop
		// gives enough time for DOM to load
		// otherwise, document.getElementsBy___ returns 'null'
		setTimeout(_ => {
			const columns = document.getElementsByClassName("sort");

			// remove old marks
			for (let i = 0; i < columns.length; ++i) {
				const column = columns[i];

				column.classList.remove('asc');
				column.classList.remove('desc');
			}

			// 'highlight' current column
			const currentColumnName = this.filterConfiguration.sort.column.toString();
			const currentColumn = document.getElementById('header-' + currentColumnName);
			currentColumn.classList.add(this.filterConfiguration.sort.order.toString());
		}, 0);
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

		// only save `showSAF` if we are opening a report
		localStorage.setItem("showSAF", JSON.stringify(this.showSAF));

    const baseUrl = "/app/report";
    this.router.navigateByUrl(`${baseUrl}/${report.id}`);
  }
}
