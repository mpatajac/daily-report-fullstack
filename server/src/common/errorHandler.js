/**
 * Output error message (if error is not custom) and return appropriate error code.
 * @param {*} error error to be handled
 * @returns defined error code (if exists, else `500`)
 */
export function handleError(error) {
	// if not a custom error,
	// print it for debugging purposes
	if (!error.code) console.error(error);

	return error.code ?? 500;
}