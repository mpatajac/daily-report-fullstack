export class Report {
	id: string;
	username: string;
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
		this.username = user;
		this.title = title;
		this.done = done;
		this.inProgress = inProgress;
		this.scheduled = scheduled;
		this.problems = problems;
		this.date = new Date();
	}
}
