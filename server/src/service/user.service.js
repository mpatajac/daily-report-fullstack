import mongodb from "mongodb";
import { database } from "../common/db.js";

export class UserService {
	static #users = database.collections("users");

	// Auth

	static async login() { }

	static async logout() { }

	// ------------------------------------------------
	// User

	static async get(username) {
		return UserService.#users.findOne({
			name: username
		});
	}

	static async exists(username) {
		const user = await UserService.#users.findOne({
			name: username
		});
		
		// `user` is 'truthy' if a match was found, 'falsy' otherwise
		return !!user;
	}

	static async update() { }

	static async changePassword() { }

}