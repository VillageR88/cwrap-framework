export function replacePlaceholdersCwrapIndex(jsonObj, index) {
	const jsonString = JSON.stringify(jsonObj);
	const replacedString = jsonString.replace(
		new RegExp(`${"cwrapIndex"}(\\+\\d+)?`, "g"),
		(match) => {
			if (match === "cwrapIndex") {
				return index;
			}
			const offset = Number.parseInt(match.replace("cwrapIndex", ""), 10);
			return index + offset;
		},
	);
	return JSON.parse(replacedString);
}

export function replacePlaceholdersCwrapArray(jsonObj, index) {
	const jsonString = JSON.stringify(jsonObj);

	// Find all cwrapArray placeholders
	const arrayMatches = jsonString.match(/cwrapArray\[(.*?)\]/g);
	if (!arrayMatches) {
		return jsonObj;
	}

	// Process each cwrapArray placeholder
	let replacedString = jsonString;
	for (const match of arrayMatches) {
		const arrayString = match.match(/\[(.*?)\]/)[1];
		const array = arrayString
			.split(",")
			.map((item) => item.trim().replace(/['"]/g, ""));
		replacedString = replacedString.replace(
			match,
			array[index] !== undefined ? array[index] : "",
		);
	}

	return JSON.parse(replacedString);
}
