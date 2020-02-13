import { User } from './user';

export interface Report {
	id: number;
	user: User;
	name: string;
	done: string[];
	inProgress: string[];
	scheduled: string[];
	problems: string[];
	date: Date;
}
