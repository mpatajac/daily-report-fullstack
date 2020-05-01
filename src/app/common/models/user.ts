export class User {
	id: number;
	name: string;
	password: string;
	darkTheme: boolean;
	showWarning: boolean;

	constructor(name: string, pass: string) {
		this.name = name;
		this.password = pass;
		this.darkTheme = false;
		this.showWarning = true;
	}
}
