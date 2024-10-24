/**
 * Serialize the DOM element to JSON. In other words convert the DOM element to a JSON object with styles appended and others like class, attributes.
 *
 * @param {HTMLElement} element - The DOM element to serialize.
 * @returns {Object} The serialized element.
 * @todo Commented you all classnames logic until solution found.
 */
export default function serializeElement(element) {
	const classroomMap = global.map.classroomMap; // TODO (Initial)
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	const obj = {
		element: element.tagName.toLowerCase(),
	};

	// if (element.className) {
	// 	obj.class = element.className;
	// }

	if (element.attributes) {
		obj.attributes = [];
		for (let i = 0; i < element.attributes.length; i++) {
			// if (

			// 	// element.attributes[i].name !== "class"
			// 	// &&
			// 	// element.attributes[i].name !== "style"
			// )
			// {
			obj.attributes.push({
				name: element.attributes[i].name,
				value: element.attributes[i].value,
			});
			// }
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

	// for (const [key, _] of cssMap) {
	// 	if (key.includes(":has")) {
	// 		const newKey = key.split(":has")[0];
	// 		const newValue = `:has${key.split(":has")[1]}`;
	// 		extendMap.set(newKey, newValue);
	// 	} else if (key.includes(":hover")) {
	// 		const newKey = key.split(":hover")[0];
	// 		const newValue = `:hover${key.split(":hover")[1]}`;
	// 		extendMap.set(newKey, newValue);
	// 	}
	// }
	// commented to confirm extende
	// if (global.map.extendMap.has(selector)) {
	// 	const newSelector = selector + global.map.extendMap.get(selector);
	// 	const newStyle = cssMap.get(newSelector);
	// 	obj.extend = [
	// 		{ extension: global.map.extendMap.get(selector), style: newStyle },
	// 	];
	// }
	// it turns out the extendMap was used but it is not the way to create extended map if all data is in cssMap so we gonna use same as we had extendedMap but we just gonna use cssMap
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
			obj.children.push(serializeElement(child));
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

	// if (element.className) {
	// 	console.log("className", element.className);
	// 	selector += `.${element.className.split(" ").join(".")}`;
	// }

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

		// if (parent.className) {
		// 	console.log("className", parent.className);

		// 	parentSelector += `.${parent.className.split(" ").join(".")}`;
		// }

		selector = `${parentSelector} > ${selector}`;
		parent = parent.parentElement;
	}

	return selector;
}
