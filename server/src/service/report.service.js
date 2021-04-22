import mongodb from "mongodb";
import { database } from "../common/db.js";

export class ReportService {
	static #reports = database.collection("reports");

	static async get(reportParams) {
		const rpp = +reportParams["rpp"];
		const page = +reportParams["page"];
		const sort = ReportService.#parseSortParams(reportParams["sort"]);
		const query = ReportService.#parseQueryParams(reportParams["searchQuery"]);

		const totalReports = await ReportService.#reports.find(query).count();
		const reports = await ReportService.#reports
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
		report.date = new Date(Date.parse(report.date));
		await ReportService.#reports.insertOne(report);
	}

	static async upload() {
		// TODO
	}

	static #parseSortParams(sortParams) {
		const sort = {};

		if (sortParams) {
			let [column, order] = sortParams.split('|');

			// map order from {asc, desc} to {1, -1}
			order = order === "asc" ? 1 : -1;

			sort[column] = order;

			// since username and title can have duplicates,
			// additionally sort by date
			if (column !== "date") {
				sort["date"] = -1;
			}
		}

		return sort;
	}

	static #parseQueryParams(queryParams) {
		/*
			example query:
			WHERE date >= '2019-04-10T00:00:00.000Z' AND date <= '2021-04-25T00:00:00.000Z' AND problems <> '[]' AND title LIKE '%test%' OR username LIKE '%test%'
		*/
		const query = {}

		if (queryParams) {
			const queryComponents = queryParams.substr(6).split(" AND ");

			// parse date boundari(es)
			const dateBoundaries = queryComponents.filter(
				c => c.startsWith("date")
			);
			if (dateBoundaries[0]) {
				query.date = {};
				ReportService.#extractDate(query, dateBoundaries[0])
			}
			if (dateBoundaries[1]) {
				ReportService.#extractDate(query, dateBoundaries[1])
			}

			// parse problems
			const problems = queryComponents.filter(
				c => c.startsWith("problems")
			)[0];
			if (problems) {
				const operator = problems.split(" ")[1];
				switch (operator) {
					case "=":
						query.problems = { $eq: '[]' };
						break;

					case "<>":
						query.problems = { $ne: '[]' };
						break;

					default:
						throw { code: 400 }
				}
			}

			// parse search terms
			const search = queryComponents.filter(
				c => c.startsWith("title") || c.startsWith("username")
			);
			if (search.length) {
				ReportService.#extractSearch(query, search);
			}
		}

		return query;
	}

	static #extractDate(query, dateString) {
		const dateCmp = dateString[5];

		let date;
		try {
			date = new Date(Date.parse(dateString.substr(9, 24)));
		} catch (error) {
			throw { code: 400 }
		}

		switch (dateCmp) {
			case '>':
				query.date.$gte = date;
				break;

			case '<':
				query.date.$lte = date;
				break;

			default:
				throw { code: 400 }
		}
	}

	static #extractSearch(query, search) {
		let joinWith = null;

		// initially two items => separated by 'AND'
		if (search.length === 2) {
			joinWith = "and";
		} else {
			search = search[0].split(" OR ");
			// if now there are two items, the were joined with 'OR'
			// otherwise, there is only one item => leave as `None`
			if (search.length === 2) {
				joinWith = "or";
			}
		}

		let titlePattern, usernamePattern;
		try {
			let titleTmp = search.filter(
				c => c.startsWith("title")
			)[0];
			if (titleTmp) {
				titlePattern = titleTmp
					.split(' ')[2]
					.slice(1, -1);
			}

			let usernameTmp = search.filter(
				c => c.startsWith("username")
			)[0];
			if (usernameTmp) {
				usernamePattern = usernameTmp
					.split(' ')[2]
					.slice(1, -1);
			}
		} catch (error) {
			throw { code: 400 }
		}

		switch (joinWith) {
			case "and":
				query.title = { $regex: titlePattern };
				query.username = { $regex: usernamePattern };
				break;

			case "or":
				query.$or = [
					{ title: { $regex: titlePattern } },
					{ username: { $regex: usernamePattern } }
				]
				break;

			default:
				if (titlePattern) {
					query.title = { $regex: titlePattern };
				}
				if (usernamePattern) {
					query.username = { $regex: usernamePattern };
				}
				break;
		}
	}
}