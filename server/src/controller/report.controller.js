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

	static async getById(req, res) {
		const report = await ReportService.getById(req.params.id);
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