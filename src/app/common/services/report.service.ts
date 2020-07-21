import { Injectable } from '@angular/core';
import { Report } from '../models/report';
import { UserService } from "./user.service";
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  user: User = {
    id: 1,
    name: "matija",
    password: "1234",
    darkTheme: true,
    showWarning: false
  }

  // TODO: get reports from DB
  reports: Report[] = [
    {
      id: 1,
      user: this.user,
      name: "Test report",
      done: [
        "Something that is done",
        "Another thing that is done",
        "Oh wow, we've been productive today"
      ],
      inProgress: ["Not so much"],
      scheduled: [
        "There are some things that are scheduled",
        "Actually here is a veeeeeeery looooooong thing that we have scheduled for some time in the near (or not so near) future"
      ],
      problems: [
        "Problem",
        "Another one",
        "Another one",
        "Another one",
        "Another one",
        "Another one",
        "Another one",
        "Another one",
      ],
      date: new Date()
    },
    {
      id: 2,
      user: this.user,
      name: "Test report",
      done: [],
      inProgress: [],
      scheduled: ["Some thing that is scheduled."],
      problems: [],
      date: new Date()
    },
    {
      id: 3,
      user: this.user,
      name: "Test report",
      done: [],
      inProgress: [],
      scheduled: [],
      problems: [],
      date: new Date()
    }
  ];


  constructor(private userService: UserService) { }

  getReports(): Report[] {
    return this.reports;
  }

  getReport(id: number): Report {
    return this.reports.find(report => report.id === id);
  }

  addReport(report: Report): void {
    // Fix potentialy empty fields
    report = this.fixReport(report);

    // TODO: insert report into DB
    this.reports.push(report);
  }

  fixReport(report: Report) {
    if (report.done === undefined) report.done = [];
    if (report.inProgress === undefined) report.inProgress = [];
    if (report.scheduled === undefined) report.scheduled = [];
    if (report.problems === undefined) report.problems = [];
    return report;
  }
}
