import { stateNonContextual, stateContextual } from "./_const.js";

/**
 * Populates the select options with the generated CSS selectors.
 * @todo problem is probably related to cssMap
 */
export default function populateSelectOptions() {
	const cssMap = global.map.cssMap;
	const selectElement = global.id.elementSelect;
	const mainTemplatesSelectorParent = global.id.mainTemplatesSelectorParent;
	mainTemplatesSelectorParent.innerHTML = "";
	selectElement.innerHTML = "";

	//root color for style root var --colorFill
	const colorFill = document.documentElement.style.getPropertyValue(
		"--colorFill-regular",
	);
	const svgTemplate = `
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}">
			<path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/>
		</svg>`;
	const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgTemplate)}`;
	selectElement.style.backgroundImage = `url("${svgDataUrl}")`;
	selectElement.style.backgroundSize = "24px 24px"; // Adjust size as needed
	selectElement.style.backgroundRepeat = "no-repeat";

	mainTemplatesSelectorParent.style.backgroundImage = `url("${svgDataUrl}")`;
	mainTemplatesSelectorParent.style.backgroundSize = "24px 24px"; // Adjust size as needed
	mainTemplatesSelectorParent.style.backgroundRepeat = "no-repeat";

	const fullContext = stateContextual.concat(stateNonContextual);
	for (const [key, value] of cssMap) {
		if (fullContext.some((context) => key.includes(context))) continue;
		if (/(^|\s)li:nth-of-type\(\d+\)(\s|$)/.test(key)) continue;
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		selectElement.appendChild(option);
		// mainTemplatesSelectorParent.innerHTML = selectElement.innerHTML;
		// mainTemplatesSelectorParent.appendChild(option.cloneNode(true));
	}
}
