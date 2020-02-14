import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
  labels: string[] = [
    "done",
    "in progress",
    "scheduled",
    "problems"
  ];

  showWarning: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
