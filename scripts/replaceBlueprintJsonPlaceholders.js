export default function replaceBlueprintJsonPlaceholders(
	jsonObj,
	placeholder,
	index,
) {
	const jsonString = JSON.stringify(jsonObj);
	const replacedString = jsonString.replace(
		new RegExp(`${placeholder}(\\+\\d+)?`, "g"),
		(match) => {
			if (match === placeholder) {
				return index;
			}
			const offset = Number.parseInt(match.replace(placeholder, ""), 10);
			return index + offset;
		},
	);
	return JSON.parse(replacedString);
}
