/**
 * Serialize the DOM element to JSON. In other words convert the DOM element to a JSON object with styles appended and others like class, attributes.
 *
 * @param {HTMLElement} element - The DOM element to serialize.
 * @param {boolean} isForBuild - Whether the serialization is for the build process.
 * @returns {Object|null} The serialized element or null if the element does not have the customTag property set to cwrapTemp.
 */
export default function serializeElement(element, isForBuild) {
	if (element.customTag !== "cwrapTemp" && !isForBuild) {
		return null;
	}

	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	const obj = {
		element: element.tagName.toLowerCase(),
	};

	// Serialize attributes
	if (element.attributes) {
		obj.attributes = [];
		for (let i = 0; i < element.attributes.length; i++) {
			if (element.attributes[i].name !== "style") {
				obj.attributes.push({
					name: element.attributes[i].name,
					value: element.attributes[i].value,
				});
			}
		}
		if (obj.attributes.length === 0) {
			obj.attributes = undefined;
		} else {
			const attributesObj = {};
			for (const attr of obj.attributes) {
				attributesObj[attr.name] = attr.value;
			}
			obj.attributes = attributesObj;
		}
	}

	// Append styles if they exist in the cssMap
	const selector = generateCssSelectorForElement(element);
	if (cssMap.has(selector)) {
		obj.style = cssMap.get(selector);
	}

	// Handle extended styles
	const extendMap = new Map();
	for (const [key, _] of cssMap) {
		if (key.includes(":has")) {
			const newKey = key.split(":has")[0];
			const newValue = `:has${key.split(":has")[1]}`;
			extendMap.set(newKey, newValue);
		} else if (key.includes(":hover")) {
			const newKey = key.split(":hover")[0];
			const newValue = `:hover${key.split(":hover")[1]}`;
			extendMap.set(newKey, newValue);
		}
	}
	if (extendMap.has(selector)) {
		const newSelector = selector + extendMap.get(selector);
		const newStyle = cssMap.get(newSelector);
		obj.extend = [{ extension: extendMap.get(selector), style: newStyle }];
	}

	// Append media queries if they exist in the mediaQueriesMap
	const mediaQueries = [];
	for (const [query, elementsMap] of mediaQueriesMap.entries()) {
		if (elementsMap.has(selector)) {
			mediaQueries.push({
				query: query,
				style: elementsMap.get(selector),
			});
		}
	}
	if (mediaQueries.length > 0) {
		obj.mediaQueries = mediaQueries;
	}

	// Serialize child elements
	if (element.children.length > 0) {
		obj.children = [];
		for (const child of element.children) {
			const serializedChild = serializeElement(child, isForBuild);
			if (serializedChild) {
				obj.children.push(serializedChild);
			}
		}
	} else if (element.textContent) {
		obj.text = element.textContent;
	}

	return obj;
}

/**
 * Generate a CSS selector for the given element.
 *
 * @param {HTMLElement} element - The DOM element.
 * @returns {string} The CSS selector.
 */
function generateCssSelectorForElement(element) {
	let selector = element.tagName.toLowerCase();

	// Add nth-of-type for the current element if it is not body, main, nav, or footer
	if (
		!["body", "main", "nav", "footer"].includes(element.tagName.toLowerCase())
	) {
		const siblings = Array.from(element.parentElement.children).filter(
			(sibling) =>
				sibling.tagName.toLowerCase() === element.tagName.toLowerCase(),
		);

		if (siblings.length > 0) {
			const index = siblings.indexOf(element) + 1;
			selector += `:nth-of-type(${index})`;
		}
	}

	// Traverse up the DOM tree to build the full selector path
	let parent = element.parentElement;
	while (parent && parent.tagName.toLowerCase() !== "html") {
		let parentSelector = parent.tagName.toLowerCase();

		// Add nth-of-type for parent elements that are not body, main, nav, or footer
		if (
			!["body", "main", "nav", "footer"].includes(parent.tagName.toLowerCase())
		) {
			const siblings = Array.from(parent.parentElement.children).filter(
				(sibling) =>
					sibling.tagName.toLowerCase() === parent.tagName.toLowerCase(),
			);
			if (siblings.length > 0) {
				const index = siblings.indexOf(parent) + 1;
				parentSelector += `:nth-of-type(${index})`;
			}
		}

		selector = `${parentSelector} > ${selector}`;
		parent = parent.parentElement;
	}

	return selector;
}
