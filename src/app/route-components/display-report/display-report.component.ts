import { Component, OnInit, Input } from '@angular/core';
import { Report } from 'src/app/common/models/report';

@Component({
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.scss']
})
export class DisplayReportComponent implements OnInit {
  report: Report = {
    id: 1,
    user: {
      name: "matija",
      id: 17,
      password: "hehe",
      darkTheme: false,
      showWarning: false
    },
    name: "Test report",
    done: [
      "Something that is done",
      "Another thing that is done",
      "Oh wow, we've been productive today"
    ],
    inProgress: ["Not so much"],
    scheduled: ["There are some things that are scheduled", "Actually here is a veeeeeeery looooooong thing that we have scheduled for some time in the near (or not so near) future"],
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
  };

  date: string = this.report.date.toDateString();

  constructor() { }

  ngOnInit() {
  }

}
