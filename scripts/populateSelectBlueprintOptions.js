import getElementFromPath from "./getElementFromPath.js";
import validateRemoveElement from "./validateRemoveElement.js";

export default function populateSelectBlueprintOptions() {
	const blueprintMap = global.map.blueprintMap;
	const currentElement = getElementFromPath();
	const selector = currentElement.timeStamp;
	const currentMap = blueprintMap.get(selector);
	const selectBlueprintElement = global.id.blueprintSelect;
	selectBlueprintElement.innerHTML = "";
	const colorFill = document.documentElement.style.getPropertyValue(
		"--colorFill-regular",
	);
	const svgTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}">
            <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/>
        </svg>`;
	const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgTemplate)}`;
	selectBlueprintElement.style.backgroundImage = `url("${svgDataUrl}")`;
	selectBlueprintElement.style.backgroundSize = "24px 24px"; // Adjust size as needed
	selectBlueprintElement.style.backgroundRepeat = "no-repeat";

	function processMap(map, parentRoute = "", siblingCountMap = new Map()) {
		if (map?.element) {
			const element = map.element;

			if (!siblingCountMap.has(parentRoute)) {
				siblingCountMap.set(parentRoute, new Map());
			}
			const parentSiblingCount = siblingCountMap.get(parentRoute);

			let route = parentRoute;

			if (element === "body" || element === "main" || element === "footer") {
				route += (parentRoute ? " > " : "") + element;
			} else if (element === "li" && !parentSiblingCount.has(element)) {
				route += ` > ${element}`;
				parentSiblingCount.set(element, 1); // Initialize to 1 to skip nth-of-type for the first li
			} else {
				if (!parentSiblingCount.has(element)) {
					parentSiblingCount.set(element, 0);
				}
				parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);
				route += ` > ${element}:nth-of-type(${parentSiblingCount.get(element)})`;
			}

			const option = document.createElement("option");
			option.value = route;
			option.textContent = route;
			selectBlueprintElement.appendChild(option);

			if (map.children) {
				if (Array.isArray(map.children)) {
					for (const child of map.children) {
						processMap(child, route, siblingCountMap);
					}
				} else {
					processMap(map.children, route, siblingCountMap);
				}
			}
		}
	}

	processMap(currentMap);
	validateRemoveElement(true);
	// for (const option of selectBlueprintElement.options) {
	//     console.log(option.value);
	// }
}
