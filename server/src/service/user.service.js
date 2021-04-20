import { database } from "../common/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "config";

export class UserService {
	static #users = database.collection("users");

	// Auth

	static async login(loginParams) {
		const { username, password, grant_type } = loginParams;

		if (grant_type !== "password") {
			throw { code: 400 };
		}

		const user = await this.#fetchUser(username);
		if (!user) {
			throw { code: 404 };
		}

		if (!(await bcrypt.compare(password, user.password))) {
			throw { code: 401 };
		}
		return UserService.#signToken(user);
	}

	static async logout(logoutParams) {
		const token = logoutParams.token;

		// TODO: add token to `blacklist`

		return true;
	}

	// ------------------------------------------------
	// User

	static async get(username) {
		return await this.#fetchUser(username);
	}

	static async exists(username) {
		const user = await this.#fetchUser(username);

		// `user` is 'truthy' if a match was found, 'falsy' otherwise
		return !!user;
	}

	static async update() { }

	static async changePassword() { }


	static async #fetchUser(username) {
		return await UserService.#users.findOne({
			name: username
		});
	}

	static #signToken(user) {
		const jwtConfig = config.get('jwt');
		return jwt.sign(
			{ id: user._id, username: user.name },
			jwtConfig.secret,
			{ expiresIn: jwtConfig.expiresIn }
		);
	}
}