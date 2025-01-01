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

    // Function to match the outermost `cwrapArray[...]` while handling nested brackets
    const findCwrapArrayMatches = (str) => {
        const matches = [];
        let bracketCount = 0;
        let startIndex = -1;

        for (let i = 0; i < str.length; i++) {
            if (str.slice(i, i + 10) === "cwrapArray") {
                if (startIndex === -1) {
                    startIndex = i;
                }
            }
            if (str[i] === "[") {
                if (startIndex !== -1) bracketCount++;
            } else if (str[i] === "]") {
                if (startIndex !== -1) bracketCount--;
                if (bracketCount === 0 && startIndex !== -1) {
                    matches.push(str.slice(startIndex, i + 1));
                    startIndex = -1;
                }
            }
        }

        return matches;
    };

    const arrayMatches = findCwrapArrayMatches(jsonString);
    if (!arrayMatches.length) {
        return jsonObj;
    }

    // Process each `cwrapArray` placeholder
    let replacedString = jsonString;
    for (const match of arrayMatches) {
        const arrayContent = match.match(/\[(.*)\]/s)[1]; // Extract everything inside the outermost brackets

        // Determine the delimiter
        const delimiter = arrayContent.includes("cwrapBreak") ? "cwrapBreak" : ",";

        const array = arrayContent
            .split(delimiter)
            .map((item) => item.trim().replace(/['"]/g, ""));

        replacedString = replacedString.replace(
            match,
            array[index] !== undefined ? array[index] : "",
        );
    }

    return JSON.parse(replacedString);
}
