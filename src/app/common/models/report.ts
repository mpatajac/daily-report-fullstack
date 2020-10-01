export class Report {
	id: string;
	user: string;
	title: string;
	done: string[];
	inProgress: string[];
	scheduled: string[];
	problems: string[];
	date: Date;

	constructor(
		user: string,
		title: string,
		done: string[],
		inProgress: string[],
		scheduled: string[],
		problems: string[],
	) {
		this.user = user;
		this.title = title;
		this.done = done;
		this.inProgress = inProgress;
		this.scheduled = scheduled;
		this.problems = problems;
		this.date = new Date();
	}
}
