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
