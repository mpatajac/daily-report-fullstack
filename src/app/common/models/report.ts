import { User } from './user';

export class Report {
	id: number;
	user: User;
	name: string;
	done: string[];
	inProgress: string[];
	scheduled: string[];
	problems: string[];
	date: Date;

	constructor(
		user: User,
		name: string,
		done: string[],
		inProgress: string[],
		scheduled: string[],
		problems: string[],
	) {
		this.user = user;
		this.name = name;
		this.done = done;
		this.inProgress = inProgress;
		this.scheduled = scheduled;
		this.problems = problems;
		this.date = new Date();
	}
}
