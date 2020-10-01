import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Report } from '../models/report';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = "https://api.baasic.com/v1/daily-report-app/resources/Report";

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  // TODO: add sorting, filtering, paging etc.
  async getReports(): Promise<Report[]> {
    const header = this.userService.createHeader();

    let response: any = await this.http.get(
      `${this.baseUrl}`,
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
}
