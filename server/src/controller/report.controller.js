import { ReportService } from "../service/report.service.js";
import { handleError } from "../common/errorHandler.js";

export class ReportController {
	static async get(req, res) {
		const reportParams = req.query;
		try {
			const reports = await ReportService.get(reportParams);
			res.send(reports.map(ReportController.#fixId));
		} catch (error) {
			res.sendStatus(handleError(error));
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
			res.sendStatus(handleError(error));
		}
	}

	static async upload(req, res) {
		// TODO
	}

	static #fixId(report) {
		report.id = report._id;
		delete report._id;
		return report;
	}

}