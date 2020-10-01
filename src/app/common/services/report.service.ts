import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Report } from '../models/report';
import { Column, SortOptions, SortOrder } from '../models/sort';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = "https://api.baasic.com/v1/daily-report-app/resources/Report";
  page: number = 1;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  async getReports(configuration?): Promise<Report[]> {
    const header = this.userService.createHeader();
    const parameters: string = this.setCriteriaParameters(configuration);

    let response: any = await this.http.get(
      `${this.baseUrl}/?${parameters}`,
      { headers: header }
    ).toPromise();

    let reports = response.item;
    reports.forEach(report => this.fixDate(report));

    return reports;
  }

  async getReportById(id: string): Promise<Report> {
    const header = this.userService.createHeader();

    let report: any = await this.http.get(
      `${this.baseUrl}/${id}`,
      { headers: header }
    ).toPromise();

    this.fixDate(report);
    return report;
  }

  addReport(report: Report): void {
    // copy report and change date format
    let requestBody: any = report;
    requestBody.date = report.date.toJSON();

    const header = this.userService.createHeader();

    this.http.post(
      `${this.baseUrl}`,
      requestBody,
      { headers: header }
    ).subscribe();
  }

  /**
   * Turn ISO 8601 formated date to Date object
   */
  fixDate(report) {
    report.date = new Date(JSON.parse(`"${report.date}"`));
  }

  
  setCriteriaParameters(configuration): string {
    let searchParameters: string = "";

    // sorting
    const sortOptions = configuration.sortOptions ?? {
      column: Column.Date,
      order: SortOrder.Desc
    } as SortOptions;
    searchParameters += `sort=${sortOptions.column}|${sortOptions.order}`;
    
    // pageing
    const rpp = this.page * 10;
    searchParameters += `&page=1&rpp=${rpp}`;
    
    
    // search/filter
    const search = this.configureSearch(configuration);
    searchParameters += search;

    console.log(searchParameters);
    
    return searchParameters;
  }

  configureSearch(configuration): string {
    let query: string = "";

    // date
    if (configuration.startDate) {
      query += `date >= '${configuration.startDate}' AND`;
    }

    if (configuration.endDate) {
      query += `date <= '${configuration.endDate}' AND`;
    }

    // problems
    if (configuration.problems !== "all") {
      let operand = configuration.problems === "without" ? '=' : '<>';
      query += `problems ${operand} '[]' AND`;
    }


    // search/filter
    if (configuration.searchByTitle?.length && configuration.searchByUser?.length) {
      query += `title LIKE '%${configuration.searchByTitle}%' AND user LIKE '%${configuration.searchByUser}%' AND`
    } else if (configuration.searchByTitle?.length || configuration.searchByUser?.length || query !== "") {
      let byTitle = configuration.searchByTitle ?? configuration.generalSearch;
      let byUser = configuration.searchByUser ?? configuration.generalSearch;
      query += `(title LIKE '%${byTitle}%' OR user LIKE '%${byUser}%') AND`
    } else {
      query = configuration.generalSearch ?? "";
    }


    if (query !== "") {
      // since it can't be known which of the subqueries will be
      // the last one, every one ends with an ' AND'
      // so we can chain them and then just remove the last ' AND'
      query = `WHERE ${query.substring(0, query.length - 4)}`
    }
    return query;
  }
}
