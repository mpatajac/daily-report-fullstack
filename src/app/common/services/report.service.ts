import { Injectable } from '@angular/core';
import { Report } from '../models/report';
import { UserService } from "./user.service";
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  user: User = {
    name: "matija",
    darkTheme: true,
    showWarning: false
  }

  // TODO: get reports from DB
  reports: Report[] = [
    {
      id: "1",
      user: this.user.name,
      title: "Test report",
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
      id: "2",
      user: this.user.name,
      title: "Test report",
      done: [],
      inProgress: [],
      scheduled: ["Some thing that is scheduled."],
      problems: [],
      date: new Date()
    },
    {
      id: "3",
      user: this.user.name,
      title: "Test report",
      done: [],
      inProgress: [],
      scheduled: [],
      problems: [],
      date: new Date()
    }
  ];

  id: number = 4;

  constructor(private userService: UserService) { }

  /**
   * Temporary method to generate ID
   * WILL BE REMOVED
   */
  getNextID(): number {
    return this.id++;
  }

  getReports(): Report[] {
    return this.reports;
  }

  getReport(id: string): Report {
    return this.reports.find(report => report.id === id);
  }

  addReport(report: Report): void {
    // TODO: insert report into DB
    this.reports.push(report);
  }
}
