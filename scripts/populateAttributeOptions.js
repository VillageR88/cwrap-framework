/**
 * @type {import('./_globals.js')}
 */
/**
 *
 * @param {Document} doc
 */
export default function populateAttributeOptions() {
	const preview = global.id.preview;
	const doc = preview.contentDocument || preview.contentWindow.document;
	const selectorMap = new Map();
	const elements = [doc.body, ...doc.body.querySelectorAll("*")];

	for (const element of elements) {
		const selector = getFullSelector(element);
		const attributes = getAttributes(element);

		if (!selectorMap.has(selector)) {
			selectorMap.set(selector, new Map());
		}

		for (const attribute of attributes) {
			const attributeName = attribute.name;
			const attributeValue = attribute.value;

			// Exclude the 'style' attribute
			if (attributeName === "style") continue;

			if (!selectorMap.get(selector).has(attributeName)) {
				selectorMap.get(selector).set(attributeName, new Set());
			}

			selectorMap.get(selector).get(attributeName).add(attributeValue);
		}
	}

	// Final log statement to show the complete selectorMap with straight values
	const simplifiedSelectorMap = new Map();
	for (const [selector, attributesMap] of selectorMap.entries()) {
		const simplifiedAttributesMap = new Map();
		for (const [attributeName, attributeValues] of attributesMap.entries()) {
			const valuesArray = Array.from(attributeValues);
			const valuesString =
				valuesArray.length === 1 ? valuesArray[0] : valuesArray;
			simplifiedAttributesMap.set(attributeName, valuesString);
		}
		simplifiedSelectorMap.set(
			selector.replace(".glowing", ""),
			simplifiedAttributesMap,
		);
	}
	const elementAttributes = simplifiedSelectorMap.get(
		global.id.elementSelect.value,
	);
	const attributeSelect = global.id.attributeSelect;
	attributeSelect.innerHTML = "";
	if (!elementAttributes) return;
	for (const [attributeName, attributeValues] of elementAttributes.entries()) {
		if (attributeValues === "glowing") return; //this in future has to be replaced with some collection of build-in CWRAP unique classes
		const option = document.createElement("option");
		option.value = attributeName;
		option.textContent = attributeName;
		attributeSelect.appendChild(option);
	}
}

function getFullSelector(element) {
	let selector = getSelector(element);
	let parent = element.parentElement;

	while (parent && parent.tagName.toLowerCase() !== "html") {
		selector = `${getSelector(parent)} > ${selector}`;
		parent = parent.parentElement;
	}

	return selector;
}

function getSelector(element) {
	const id = element.id ? `#${element.id}` : "";
	const tagName = element.tagName.toLowerCase();
	const nthOfType = ["body", "main", "footer"].includes(tagName)
		? ""
		: getNthOfType(element);
	const classes = element.className
		? `.${element.className.replace(/\s+/g, ".")}`
		: "";

	return `${tagName}${id}${nthOfType}${classes}`;
}

function getNthOfType(element) {
	const parent = element.parentNode;
	if (!parent) return "";

	const tagName = element.tagName.toLowerCase();
	let index = 1;

	for (const sibling of parent.children) {
		if (sibling === element) {
			return `:nth-of-type(${index})`;
		}
		if (sibling.tagName.toLowerCase() === tagName) {
			index++;
		}
	}

	return "";
}

function getAttributes(element) {
	const attributes = element.attributes;
	const result = [];

	for (const attribute of attributes) {
		result.push(attribute);
	}

	return result;
}
