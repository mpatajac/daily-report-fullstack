import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';

import { User } from '@app/common/models/user';
import { Report } from '@app/common/models/report';

import { UserService } from '@app/common/services/user.service';
import { ReportService } from '@app/common/services/report.service';



@Component({
	selector: 'app-create-report',
	templateUrl: './create-report.component.html',
	styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
	user: User;
	reportTitle: string;
	done: Array<string>;
	inProgress: Array<string>;
	scheduled: Array<string>;
	problems: Array<string>;


	constructor(
		private userService: UserService,
		private reportService: ReportService,
		private router: Router
	) { }

	async ngOnInit() {
		this.user = await this.userService.getUser();
		this.done = [];
		this.inProgress = [];
		this.scheduled = [];
		this.problems = [];
	}

	updateDone(reportContent: Array<string>) {
		this.done = reportContent;
	}

	updateInProgress(reportContent: Array<string>) {
		this.inProgress = reportContent;
	}

	updateScheduled(reportContent: Array<string>) {
		this.scheduled = reportContent;
	}

	updateProblems(reportContent: Array<string>) {
		this.problems = reportContent;
	}

	submitReport() {
		let report = new Report(
			this.user.name,
			this.reportTitle,
			this.done,
			this.inProgress,
			this.scheduled,
			this.problems
		);

		this.reportService.addReport(report);
		this.router.navigateByUrl("/app/dashboard")
	}

	/**
	 * User can submit report if it has a title and
	 * at least one element (done, in progress, scheduled, done) is filled.
	 * @param form Form used in creating a new report
	 */
	canSubmit(form: NgForm): boolean {
		return form.valid && (
			!!this.done?.length ||
			!!this.inProgress?.length ||
			!!this.scheduled?.length ||
			!!this.problems?.length
		);
	}

}
