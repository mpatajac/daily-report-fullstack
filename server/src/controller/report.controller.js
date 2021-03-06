import { ReportService } from "../service/report.service.js";
import { handleError } from "../common/errorHandler.js";

export class ReportController {
	static async get(req, res) {
		const reportParams = req.query;
		try {
			const result = await ReportService.get(reportParams);
			result.reports.map(ReportController.#fixId);
			res.send(result);
		} catch (error) {
			res.sendStatus(await handleError(error));
		}
	}

	static async exists(req, res) {
		const found = await ReportService.exists();
		const status = found ? 204 : 404;
		res.sendStatus(status);
	}

	static async getById(req, res) {
		const id = req.params.id;
		const report = await ReportService.getById(id);
		if (!report) {
			res.sendStatus(404);
		} else {
			res.send(ReportController.#fixId(report));
		}
	}

	static async create(req, res) {
		const report = req.body;
		try {
			await ReportService.create(report);
			res.sendStatus(201);
		} catch (error) {
			res.sendStatus(await handleError(error));
		}
	}

	static async upload(req, res) {
		const reportFile = req.file;
		const username = req.body.username;
		try {
			const parsedReport = await ReportService.upload(username, reportFile);
			res.send(parsedReport);
		} catch (error) {
			res.sendStatus(await handleError(error))
		}
	}

	static #fixId(report) {
		report.id = report._id;
		delete report._id;
		return report;
	}

}