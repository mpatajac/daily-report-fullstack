import { Component, OnInit } from '@angular/core';
import { Report } from '../../common/models/report';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {
  showSearchAndFilterFields: boolean = true;

  reports: Report[] = [
    {
      id: 1,
      user: {
        name: "matija",
        id: 17,
        password: "hehe",
        darkTheme: false
      },
      name: "Test report",
      done: [""],
      inProgress: [""],
      scheduled: [""],
      problems: [],
      date: new Date()
    },
    {
      id: 2,
      user: {
        name: "matija",
        id: 17,
        password: "hehe",
        darkTheme: false
      },
      name: "Test report",
      done: [""],
      inProgress: [""],
      scheduled: [""],
      problems: [""],
      date: new Date()
    },
    {
      id: 3,
      user: {
        name: "matija",
        id: 17,
        password: "hehe",
        darkTheme: false
      },
      name: "Test report",
      done: [""],
      inProgress: [""],
      scheduled: [""],
      problems: [],
      date: new Date()
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
