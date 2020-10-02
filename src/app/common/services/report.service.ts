import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Report } from '../models/report';
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
    searchParameters += `sort=${configuration.sort.column}|${configuration.sort.order}`;

    // pageing
    const rpp = this.page * 10;
    searchParameters += `&page=1&rpp=${rpp}`;

    // search/filter
    const search = this.configureSearch(configuration);
    searchParameters += search;

    return searchParameters;
  }

  configureSearch(configuration): string {
    let query: string = "";

    // date
    if (configuration.startDate) {
      query += `date >= '${configuration.startDate}' AND `;
    }

    if (configuration.endDate) {
      query += `date <= '${configuration.endDate}' AND `;
    }

    // problems
    if (configuration.problems !== "all") {
      let operand = configuration.problems === "without" ? '=' : '<>';
      query += `problems ${operand} '[]' AND `;
    }


    // search/filter
    let somethingAdded = false, addWhere = true;

    if (configuration.searchByTitle?.length && configuration.searchByUser?.length) {
      query += `title LIKE '%${configuration.searchByTitle}%' AND username LIKE '%${configuration.searchByUser}%'`;
      somethingAdded = true;

    } else if (configuration.searchByTitle?.length || configuration.searchByUser?.length || query !== "") {
      let firstPart = "", secondPart = "";
      if (configuration.searchByTitle || configuration.generalSearch) {
        let byTitle = configuration.searchByTitle ?? configuration.generalSearch;
        firstPart = `title LIKE '%${byTitle}%'`;
        somethingAdded = true;
      }

      if (configuration.searchByUser || configuration.generalSearch) {
        let byUser = configuration.searchByUser ?? configuration.generalSearch;
        secondPart = `username LIKE '%${byUser}%'`;
        somethingAdded = true;
      }

      let bothIn = firstPart && secondPart;
      query += bothIn ? `(${firstPart} OR ${secondPart})` : `${firstPart}${secondPart}`;

    } else {
      if (configuration.generalSearch) {
        query = configuration.generalSearch;
        somethingAdded = true;

        // if we are only searching by generalSearch, 
        // we don't need "WHERE" inside our query
        addWhere = false;
      }
    }

    if (somethingAdded) {
      query += ` AND `;
    }


    // final
    if (query !== "") {
      // since it can't be known which of the subqueries will be
      // the last one, every one ends with an ' AND'
      // so we can chain them and then just remove the last ' AND'
      query = `&searchQuery=${addWhere ? "WHERE " : ""}${query.substring(0, query.length - 4)}`
    }

    return query;
  }
}
