import { Component, OnInit } from '@angular/core';
import { Report } from '../../common/models/report';
import { Column, SortOrder, SortOptions } from '../../common/models/sort'
import { ReportService } from '../../common/services/report.service';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {
  showSAF: boolean;
  reports: Report[];

  generalSearch: string;
  searchByTitle: string;
  searchByUser: string;
  startDate: Date;
  endDate: Date;
  selectedOption: string;
  sortConfiguration: SortOptions;
  filterConfiguration: any;

  constructor(private reportService: ReportService) { }

  async ngOnInit() {
    this.showSAF = false;
    this.selectedOption = "all";

    // Initially, display reports from newest to oldest
    this.sortConfiguration = {
      column: Column.Date,
      order: SortOrder.Desc
    } as SortOptions;

    this.filterConfiguration = {
      generalSearch: this.generalSearch,
      searchByTitle: this.searchByTitle,
      searchByUser: this.searchByUser,
      startDate: this.startDate,
      endDate: this.endDate,
      problems: this.selectedOption,
      sort: this.sortConfiguration
    };

    this.reportService.resetPage();

    await this.getReports();
  }

  toggleSAFVisibility() {
    this.showSAF = !this.showSAF;
  }

  isSelectedOption(option: string): boolean {
    return option === this.selectedOption;
  }

  async selectDropdownOption(option: string) {
    this.filterConfiguration.problems = this.selectedOption = option;
    this.reportService.resetPage();
    await this.getReports();
  }

  async configureSort(column: string) {
    this.updateTableHeader(column);
    this.reportService.resetPage();

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
    await this.getReports();
  }

  async updateGeneralSearch(value: string) {
    if (value !== this.generalSearch) {
      this.filterConfiguration.generalSearch = this.generalSearch = value;
      this.reportService.resetPage();
      await this.getReports();
    }
  }

  async updateSearchByTitle(value: string) {
    if (value !== this.searchByTitle) {
      this.filterConfiguration.searchByTitle = this.searchByTitle = value;
      this.reportService.resetPage();
      await this.getReports();
    }
  }

  async updateSearchByUser(value: string) {
    if (value !== this.searchByUser) {
      this.filterConfiguration.searchByUser = this.searchByUser = value;
      this.reportService.resetPage();
      await this.getReports();
    }
  }

  async updateStartDate(value: Date) {
    if (value !== this.startDate) {
      this.startDate = value;
      this.filterConfiguration.startDate = this.startDate?.toJSON();
      this.reportService.resetPage();
      await this.getReports();
    }
  }

  async updateEndDate(value: Date) {
    if (value !== this.endDate) {
      // use day after set date (to include reports submitted on that day)
      value?.setDate(value?.getDate() + 1);
      this.endDate = value;
      
      this.filterConfiguration.endDate = this.endDate?.toJSON();
      this.reportService.resetPage();
      await this.getReports();
    }
  }

  async getReports() {
    let newReports = await this.reportService.getReports(this.filterConfiguration);
    if (this.reportService.page === 1) {
      this.reports = newReports;
    } else {
      this.reports = this.reports.concat(newReports);
    }
  }

  async moreReports() {
    this.reportService.nextPage();
    this.getReports();
  }

  existRemainingReports(): boolean {
    return this.reports.length < this.reportService.totalReports;
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
      this.generalSearch,
      this.searchByTitle,
      this.searchByUser,
      this.startDate,
      this.endDate
    ].some(this.isAltered) ||
      this.selectedOption !== "all";
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
}
