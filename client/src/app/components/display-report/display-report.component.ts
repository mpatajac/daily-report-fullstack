import { Component, OnInit, Input } from '@angular/core';
import { Report } from '@app/common/models/report';


@Component({
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.scss']
})
export class DisplayReportComponent implements OnInit {
  @Input() report: Report;
  @Input() date: string;

  constructor() { }

	ngOnInit() {
	
	}

}
