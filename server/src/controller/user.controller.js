import { UserService } from "../service/user.service.js";

export class UserController {
	// Auth

	static async login(req, res) {

	}
	
	static async logout(req, res) {

	}

	// ------------------------------------------------
	// User

	static async get(req, res) {
		const user = await UserService.get(req.params.username);
		if (!user) {
			res.sendStatus(404);
		} else {
			res.send(user);
		}
	}

	static async exists(req, res) {
		const found = await UserService.exists(req.params.username);
		const status = found ? 204 : 404;
		res.sendStatus(status);
	}

	static async update(req, res) {
		const updateParams = req.body;
		try {
			await UserService.update(updateParams);
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(error.code);
		}
	}

	static async changePassword(req, res) {
		const newPassword = req.body.newPassword;
		try {
			await UserService.changePassword(newPassword);
			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(error.code);
		}
	}
}