import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-element',
  templateUrl: './report-element.component.html',
  styleUrls: ['./report-element.component.scss']
})
export class ReportElementComponent implements OnInit {
  @Input() label: string;

  constructor() { }

  ngOnInit() {
  }

}
