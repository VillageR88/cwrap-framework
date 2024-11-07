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

// now we gonna create this array function and i will explain it
// cwrapArray["text1","text2",...] it is all user gonna do and function takes care of the rest
//function will take parameters jsonObj, index, array and it will work that way that
//takes text from jsonObj and replaces it with array[index] and returns new jsonObj
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
