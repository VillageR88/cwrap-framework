export default function getCssProperties() {
	// Create a dummy element to access the full list of possible CSS properties
	const dummyElement = document.createElement("div");

	// Access the style object, which contains all possible CSS properties
	const allCSSProperties = dummyElement.style;

	// Log all the CSS properties
	const cssProperties = [];
	for (const property in allCSSProperties) {
		if (Object.prototype.hasOwnProperty.call(allCSSProperties, property)) {
			// Convert camelCase to kebab-case
			const kebabCaseProperty = camelCaseToKebabCase(property);
			cssProperties.push(kebabCaseProperty);
		}
	}
	return cssProperties;
}

function camelCaseToKebabCase(camelCase) {
	return camelCase.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
