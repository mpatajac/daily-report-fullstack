export class User {
	name: string;
	darkTheme: boolean;
	showWarning: boolean;

	constructor(name: string) {
		this.name = name;
		this.darkTheme = false;
		this.showWarning = true;
	}
}
