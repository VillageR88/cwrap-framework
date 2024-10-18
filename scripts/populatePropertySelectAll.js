/**
 * Populates the state property or property select element with all available CSS properties
 * that are not currently applied to the element specified by the full path.
 *
 * @param {string} fullPath - The full path of the element.
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Array} cssProperties - The object containing all CSS properties.
 * @param {boolean} isState - The boolean indicating whether the state property select element
 * @todo applied styles are wrongly checked for state properties
 */
export default function populatePropertySelectAll(cssProperties, isState) {
	const cssMap = global.map.cssMap;
	const fullPath = global.id.elementSelect.value;
	let currentStyle;
	if (!isState) {
		currentStyle = cssMap.get(fullPath) || "";
	}
	else {
		//TODO This solution works at now but has to be changed along with that readonly input
		console.log("cssMap", cssMap);
		console.log("global.map.extendMap", global.map.extendMap);
		console.log("Full path", fullPath);
		console.log("stateContextInfo", global.id.stateContextInfo.title);
		currentStyle = cssMap.get(global.id.stateContextInfo.title) || "";
	}
	console.log("populatePropertySelectAll.js: currentStyle", currentStyle);
	const appliedProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.split(":")[0].trim());

	const propertySelectAll = global.id.propertySelectAll;
	const statePropertySelectAll = global.id.statePropertySelectAll;
	if (!isState) {
		propertySelectAll.innerHTML = "";
	} else {
		statePropertySelectAll.innerHTML = "";
	}

	for (const property of cssProperties) {
		if (!appliedProperties.includes(property)) {
			const option = document.createElement("option");
			option.value = property;
			option.textContent = property;
			if (!isState) {
				propertySelectAll.appendChild(option);
			} else {
				statePropertySelectAll.appendChild(option);
			}
		}
	}
}
