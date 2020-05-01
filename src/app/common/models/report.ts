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

	constructor(user?: User) {
		this.user = user;
	}
}
