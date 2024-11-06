/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Creates cssMap and mediaQueriesMap.
 * Generates a CSS selector string based on the provided JSON object with example outcome: "body > main> div:nth-of-type(1)"
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 */
export default function generateCssSelector(
	jsonObj,
	parentSelector = "",
	siblingCountMap = new Map(),
) {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	// Start with the parent selector
	let selector = parentSelector;

	if (jsonObj.element) {
		const element = jsonObj.element;

		// Initialize sibling count map for the parent selector if not already present
		if (!siblingCountMap.has(parentSelector)) {
			siblingCountMap.set(parentSelector, new Map());
		}
		const parentSiblingCount = siblingCountMap.get(parentSelector);

		// Handle special elements like 'body', 'main', and 'footer'
		if (element === "body" || element === "main" || element === "footer") {
			selector += (parentSelector ? " > " : "") + element;
		} else {
			// Initialize sibling count for the element if not already present
			if (!parentSiblingCount.has(element)) {
				parentSiblingCount.set(element, 0);
			}
			// Increment the sibling count for the element
			parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);

			// Append the element and its nth-of-type pseudo-class to the selector
			selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(
				element,
			)})`;
		}
		// Store the style in the cssMap if present in the JSON object
		if (jsonObj.style && jsonObj.customTag !== "cwrapBlueprintCSS") {
			cssMap.set(selector, jsonObj.style);
		} else {
			cssMap.set(selector, "");
		}

		// Handle extensions if present in the JSON object
		if (Array.isArray(jsonObj.extend)) {
			for (const extension of jsonObj.extend) {
				// Generate the extended selector
				const extendedSelector = `${selector}${extension.extension}`;
				// Store the extended style in the cssMap
				cssMap.set(extendedSelector, extension.style);
			}
		}

		// Check if the JSON object has media queries
		if (jsonObj.mediaQueries) {
			// Iterate over each media query
			for (const mediaQuery of jsonObj.mediaQueries) {
				// Create a media query selector
				const mediaQuerySelector = `${selector}`;
				// Initialize the media query map if not already present
				if (!mediaQueriesMap.has(mediaQuery.query)) {
					mediaQueriesMap.set(mediaQuery.query, new Map());
				}
				// Store the media query style in the mediaQueriesMap
				mediaQueriesMap
					.get(mediaQuery.query)
					.set(mediaQuerySelector, mediaQuery.style);
			}
		}

		// Check if the JSON object has children elements
		if (jsonObj.children) {
			// Recursively generate CSS selectors for each child element
			for (const child of jsonObj.children) {
				generateCssSelector(child, selector, siblingCountMap);
			}
		}

		// Handle blueprint property
		if (jsonObj.blueprint) {
			jsonObj.customTag = "cwrapBlueprintCSS";
			const blueprint = jsonObj.blueprint;
			for (let i = 0; i < blueprint.count; i++) {
				const blueprintChild = JSON.parse(JSON.stringify(blueprint));
				blueprintChild.element = blueprint.element;
				blueprintChild.children = blueprint.children;
				//blueprintChild.customTag = "cwrapBlueprintCSS"; //commenting this house fix the issue (not sure why) with the blueprint elements not being added to the cssMap on the first load
				generateCssSelector(blueprintChild, selector, siblingCountMap);
			}
		}
	}
}
