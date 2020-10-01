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

  constructor(private reportService: ReportService) { }

  async ngOnInit() {
    this.showSAF = false;
    this.selectedOption = "all";
    this.reports = await this.reportService.getReports();

    // Initially, display reports from newest to oldest
    this.sortConfiguration = {
      column: Column.Date,
      order: SortOrder.Desc
    } as SortOptions;

    /*
    // mora se svaki put rucno
    const data = {
      generalSearch: this.generalSearch,
      searchByTitle: this.searchByTitle,
      searchByUser: this.searchByUser,
      startDate: this.startDate,
      endDate: this.endDate,
      problems: this.selectedOption,
      sort: this.sortConfiguration
    };
    */
  }

  toggleSAFVisibility() {
    this.showSAF = !this.showSAF;
  }

  isSelectedOption(option: string): boolean {
    return option === this.selectedOption;
  }

  selectDropdownOption(option: string) {
    this.selectedOption = option;
  }

  configureSort(column: string) {
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
