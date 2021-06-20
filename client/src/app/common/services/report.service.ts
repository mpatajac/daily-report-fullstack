import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from "rxjs/operators";
import { of } from 'rxjs';

import { Report } from '@app/common/models/report';
import { UserService } from '@app/common/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = "/api/reports";
  page: number = 1;
  totalReports: number;

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

    // get total number of reports for pagination
    this.totalReports = response.totalReports;

    let reports = response.reports;
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
      { 
				headers: header,
				responseType: "text"
			}
    ).subscribe();
  }

  /**
   * Turn ISO 8601 formated date to Date object
   */
  fixDate(report) {
    report.date = new Date(JSON.parse(`"${report.date}"`));
  }

  nextPage() {
    ++this.page;
  }

  resetPage() {
    this.page = 1;
  }

  setCriteriaParameters(configuration): string {
    let searchParameters: string = "";

    // sorting
    searchParameters += `sort=${configuration.sort.column}|${configuration.sort.order}`;

    // pageing
    const rpp = 10;
    searchParameters += `&page=${this.page}&rpp=${rpp}`;

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
    let somethingAdded = false;

		// both searchByTitle and searchByUser were used
    if (configuration.searchByTitle?.length && configuration.searchByUser?.length) {
      query += `title LIKE '${configuration.searchByTitle}' AND username LIKE '${configuration.searchByUser}'`;
      somethingAdded = true;

		// only one of searchByTitle and searchByUser was used
    } else if (configuration.searchByTitle?.length || configuration.searchByUser?.length || query !== "") {
      let firstPart = "", secondPart = "";
      if (configuration.searchByTitle || configuration.generalSearch) {
        let byTitle = configuration.searchByTitle ?? configuration.generalSearch;
        firstPart = `title LIKE '${byTitle}'`;
        somethingAdded = true;
      }

      if (configuration.searchByUser || configuration.generalSearch) {
        let byUser = configuration.searchByUser ?? configuration.generalSearch;
        secondPart = `username LIKE '${byUser}'`;
        somethingAdded = true;
      }

      let bothIn = firstPart && secondPart;
      query += bothIn ? `${firstPart} OR ${secondPart}` : `${firstPart}${secondPart}`;

    } else {
      if (configuration.generalSearch) {
				query += `title LIKE '${configuration.generalSearch}' OR username LIKE '${configuration.generalSearch}'`;
        somethingAdded = true;
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
      query = `&searchQuery=WHERE ${query.substring(0, query.length - 4)}`
    }

		return query;
  }

  async uploadReport(file: File) {
    const header = this.userService.createHeader();
    const formData = new FormData();
    formData.append('report', file, file.name);
		formData.append('username', this.userService.user.name);

    const response: any = await this.http.post(
      `${this.baseUrl}/upload`,
      formData,
      { headers: header }
    ).toPromise();

    return response;
  }

	async reportsExist(): Promise<boolean> {
		const header = this.userService.createHeader();

		return this.http.get(
			`${this.baseUrl}/exists`,
			{ 
				headers: header,
				observe: 'response'
			}
		).pipe(
			map(response => response.ok),
			catchError(_ => of(false))
		).toPromise()
	}
}
