import { UserService } from "../service/user.service.js";
import { handleError } from "../common/errorHandler.js";

export class UserController {
	// Auth

	static async login(req, res) {
		const loginParams = req.body;
		try {
			const token = await UserService.login(loginParams);
			res.status(201).send(
				{ "access_token": token }
			);
		} catch (error) {
			res.sendStatus(handleError(error));
		}
	}
	
	static async logout(req, res) {
		const logoutParams = req.body;
		try {
			await UserService.logout(logoutParams);
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(handleError(error));
		}
	}

	// ------------------------------------------------
	// User

	static async get(req, res) {
		const user = await UserService.get(req.params.username);
		if (!user) {
			res.sendStatus(404);
		} else {
			res.send(UserController.#excludePassword(user));
		}
	}

	static async exists(req, res) {
		const found = await UserService.exists(req.params.username);
		const status = found ? 204 : 404;
		res.sendStatus(status);
	}

	static async updateTheme(req, res) {
		const username = req.params.username;
		const themePreference = req.body.darkTheme;
		try {
			await UserService.updateTheme(username, themePreference);
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(handleError(error));
		}
	}

	static async changePassword(req, res) {
		const username = req.params.username;
		const newPassword = req.body.newPassword;
		try {
			await UserService.changePassword(username, newPassword);
			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(handleError(error));
		}
	}

	static #excludePassword(user) {
		delete user.password;
		return user;
	}
}