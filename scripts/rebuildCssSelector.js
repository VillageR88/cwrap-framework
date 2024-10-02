/**
 * Rebuilds CSS selectors by finding the first nth-of-type greater than 1 and
 * @param {Map<string, string>} cssMap
 */
export default function rebuildCssSelectors() {
	const cssMap = global.map.cssMap;
	// Create a classless version of cssMap for comparison purposes
	const cssMapNoClass = new Map(
		Array.from(cssMap).map(([key, value]) => {
			const newKey = key.replace(/\.\w+/g, ""); // Remove class names
			return [newKey, value];
		}),
	);

	// Log the initial maps
	// console.log("Initial cssMap:", cssMap);
	// console.log("Initial cssMapNoClass:", cssMapNoClass);

	// Find the first nth-of-type greater than 1
	let firstNthOfTypeRoute = null;
	const collectedRoutes = []; // Define collectedRoutes in the outer scope

	for (const [key, value] of cssMapNoClass.entries()) {
		const match = key.match(/:nth-of-type\((\d+)\)/);
		if (match) {
			const nthOfType = Number.parseInt(match[1], 10);
			if (nthOfType > 1) {
				firstNthOfTypeRoute = key;
				// console.log(`First nth-of-type greater than 1 found: ${key}`);
				break;
			}
		}
	}

	// Collect all routes starting with the identified route
	if (firstNthOfTypeRoute) {
		for (const [key, value] of cssMapNoClass.entries()) {
			if (key.startsWith(firstNthOfTypeRoute)) {
				collectedRoutes.push(key);
			}
		}
		// console.log(
		//   `Routes starting with ${firstNthOfTypeRoute}:`,
		//   collectedRoutes
		// );
	}

	// Search for preceding nth-of-type minus 1
	if (firstNthOfTypeRoute) {
		const nthOfTypeMatch = firstNthOfTypeRoute.match(/:nth-of-type\((\d+)\)/);
		if (nthOfTypeMatch) {
			const nthOfType = Number.parseInt(nthOfTypeMatch[1], 10);
			const precedingNthOfType = nthOfType - 1;
			const precedingRoute = firstNthOfTypeRoute.replace(
				/:nth-of-type\(\d+\)/,
				`:nth-of-type(${precedingNthOfType})`,
			);
			// console.log(
			//   `Searching for preceding nth-of-type(${precedingNthOfType}): ${precedingRoute}`
			// );
			if (cssMapNoClass.has(precedingRoute)) {
				// console.log(`Preceding route found: ${precedingRoute}`);
			} else {
				// console.log(`Preceding route not found: ${precedingRoute}`);
				// Update the original map with the new routes
				for (const route of collectedRoutes) {
					const updatedRoute = route.replace(
						firstNthOfTypeRoute,
						precedingRoute,
					);
					const originalRoute = Array.from(cssMap.keys()).find(
						(key) => key.replace(/\.\w+/g, "") === route,
					);
					const updatedOriginalRoute = originalRoute.replace(
						/:nth-of-type\((\d+)\)/,
						(match, p1) => `:nth-of-type(${Number.parseInt(p1, 10) - 1})`,
					);
					const value = cssMap.get(originalRoute);
					cssMap.delete(originalRoute);
					cssMap.set(updatedOriginalRoute, value);
				}
			}
		}
	}
}
