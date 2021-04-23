import mongodb from "mongodb";
import { database } from "../common/db.js";

// TODO: error checking
class ReportParser {
	constructor() { }

	parse(raw_report, username) {
		console.log("Parsing report...");
		const report = {};

		this.#add_time_stamp(report);
		this.#add_author(report, username);

		raw_report = this.#trim_raw_report(raw_report);
		this.#parse_title(report, raw_report);
		this.#parse_components(report, raw_report);
		console.log("Report parsed!");
		return report;
	}

	#add_time_stamp(report) {
		report.date = new Date();
	}

	#add_author(report, username) {
		report.username = username;
	}

	#trim_raw_report(raw_report) {
		return raw_report.trim();
	}

	#parse_title(report, raw_report) {
		// TODO: check that there is only one title
		const regex = /^#( )?(?<title>[\w ]+)/;
		const title_match = regex.exec(raw_report);
		report.title = title_match.groups.title.trim();
	}

	#parse_components(report, raw_report) {
		const regex = /##(?<title>[\w ]+)(\n|\r\n)(?<items>(\t| )*(-(\w| )+)(\n|\r\n)?)*/g;
		const components = raw_report.match(regex);

		// TODO: check that there are only 4 components
		// (Done, In progress, Scheduled, Problems)
		for (let component of components) {
			const component_title = this.#parse_component_title(component);
			const component_items = this.#parse_component_items(component);
			report[component_title] = component_items;
		}
	}

	#parse_component_title(component) {
		const regex = /##( )?(?<title>[\w ]+)/;
		const title = regex.exec(component);
		return this.#format_component_title(title.groups.title.trim());
	}

	#parse_component_items(component) {
		const regex = /(\t| )*-(?<item>(\w| )+)/g;
		const items = component.match(regex);

		if (items) {
			return items.map(this.#clean_component_item);
		} else {
			return [];
		}
	}

	/**
	 * converts "In progress" to "inProgress"
	 */
	#format_component_title(title) {
		let title_words = title.split(" ");
		if (title_words.length == 1) {
			return title.toLowerCase();
		} else {
			title_words = title_words.map(
				word => word[0].toUpperCase() +
					word.slice(1).toLowerCase()
			);
			title_words[0] = title_words[0].toLowerCase();
			return title_words.join('');
		}
	}

	#clean_component_item(item) {
		// remove whitespace
		item = item.trim();
		// remove '-' from beginning
		item = item.substr(1)
		// remove additional whitespace and return
		return item.trim();
	}
}




export class ReportService {
	static #reports = database.collection("reports");
	static #reportParser = new ReportParser();

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

	static async upload(username, reportFile) {
		if (!username || !reportFile) {
			throw { code: 400 };
		}

		let report;
		try {
			report = reportFile.buffer.toString();
		} catch (_) {
			throw { code: 400 };
		}

		return ReportService.#reportParser.parse(report, username);
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
						query.problems = { $eq: [] };
						break;

					case "<>":
						query.problems = { $ne: [] };
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

