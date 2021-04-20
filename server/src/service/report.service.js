import mongodb from "mongodb";
import { database } from "../common/db.js";

export class ReportService {
	static #reports = database.collection("reports");

	static async get(reportParams) {
		const rpp = reportParams["rpp"];
		const page = reportParams["page"];
		const sort = ReportService.#parseSortParams(reportParams["sort"]);
		const query = ReportService.#parseQueryParams(reportParams["searchQuery"]);


		const totalReports = ReportService.#reports.find(query).count();
		const reports = ReportService.#reports
			.find(query)
			.sort(sort)
			.skip((page - 1) * rpp)
			.limit(rpp)
			.toArray();

		return {
			totalReports,
			reports
		}
	}

	static async getById(id) {
		const _id = mongodb.ObjectID(id);
		return ReportService.#reports.findOne({ _id });
	}

	static async create(report) {
		await ReportService.#reports.insertOne(report);
	}

	static async upload() {
		// TODO
	}

	static #parseSortParams(sortParams) {
		const [column, order] = sortParams.split('|');

		// map order from {asc, desc} to {1, -1}
		order = order === "asc" ? 1 : -1;

		// since username and title can have duplicates,
		// additionally sort by date
		// TODO: check if it works properly
		if (column !== "date") {
			return {
				column: order,
				"date": -1
			}
		} else {
			return {
				column: order
			}
		}
	}

	static #parseQueryParams(queryParams) {
		const query = {}

		if (queryParams) {
			// TODO!: parse search/filter parameters

		}

		return query;
	}

}