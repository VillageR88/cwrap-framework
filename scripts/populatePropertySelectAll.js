/**
 * Populates the property select element with all available CSS properties
 * that are not currently applied to the element specified by the full path.
 *
 * @param {string} fullPath - The full path of the element.
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Array} cssProperties - The object containing all CSS properties.
 */
export default function populatePropertySelectAll(
	fullPath,
	cssMap,
	cssProperties,
) {
	const currentStyle = cssMap.get(fullPath) || "";
	const appliedProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.split(":")[0].trim());

	const propertySelectAll = global.id.propertySelectAll;
	propertySelectAll.innerHTML = "";

	for (const property in cssProperties) {
		if (!appliedProperties.includes(property)) {
			const option = document.createElement("option");
			option.value = property;
			option.textContent = property;
			propertySelectAll.appendChild(option);
		}
	}
}
