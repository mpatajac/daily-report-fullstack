import {promises as fs} from "fs";

/**
 * Log error message (if error is not custom) and return appropriate error code.
 * @param {*} error error to be handled
 * @returns defined error code (if exists, else `500`)
 */
export async function handleError(error) {
	// if not a custom error,
	// print it to a log file
	if (!error.code) {
		const timestamp = new Date().getTime();
		try {
			// TODO: improve logging (username, caller function...)
			await fs.writeFile(`./log/${timestamp}.txt`, error.toString());
		} catch (e) {
			console.error(e);
		}
	}

	return error.code ?? 500;
}