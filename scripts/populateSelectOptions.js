/**
 * Populates the select options with the generated CSS selectors.
 * @todo problem is probably related to cssMap
 */
export default function populateSelectOptions() {
	const cssMap = global.map.cssMap;
	const selectElement = global.id.elementSelect;
	selectElement.innerHTML = "";
	for (const [key, value] of cssMap) {
		if (key.includes(":has") || key.includes(":hover")) continue;
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		selectElement.appendChild(option);
	}
}
