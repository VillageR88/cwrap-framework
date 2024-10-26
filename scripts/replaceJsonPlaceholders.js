/**
 * Replaces placeholders in the JSON object with the specified values and query parameters.
 *
 * @param {Object} json - The JSON object to process.
 * @returns {Object} - The processed JSON object with placeholders replaced.
 */
export default function replaceJsonPlaceholders(json) {
	const urlParams = Object.fromEntries(
		new URLSearchParams(window.location.search).entries(),
	);

	const jsonString = JSON.stringify(json);

	const convertedJson = jsonString.replace(
		/cwrapGetParams\[(.*?)\]/g,
		(_, param) => {
			return urlParams[param] || "";
		},
	);

	try {
		return JSON.parse(convertedJson);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return json;
	}
}
