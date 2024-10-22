import updateElementInfo from "./updateElementInfo.js";
import getElementFromPath from "./getElementFromPath.js";
/**
 *
 * @param {Map} cssMap
 * @param {Map} mediaQueriesMap
 */
export default function populateElementStateOptions() {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	let currentMap;
	if (navAdditionalScreen.classList.contains("screenDesktop")) {
		currentMap = cssMap;
	} else if (navAdditionalScreen.classList.contains("screenTablet")) {
		currentMap = mediaQueriesMap.get("max-width: 768px");
	} else if (navAdditionalScreen.classList.contains("screenMobile")) {
		currentMap = mediaQueriesMap.get("max-width: 640px");
	}

	const elementStateSelect = global.id.elementStateSelect;
	const optionsMap = new Map();
	let firstKey;
	for (const [key, value] of currentMap) {
		// console.log("key", key);
		// console.log("selectedElement", global.id.elementSelect.value);
		// console.log(key.includes(`${global.id.elementSelect.value}:`));
		// console.log("key", key);
		if (key.includes(`${global.id.elementSelect.value}:`)) {
			if (!firstKey) firstKey = key;
			optionsMap.set(key, value);
		}
	}
	elementStateSelect.innerHTML = "";
	for (const [key, _] of optionsMap) {
		const option = document.createElement("option");
		option.value = key;
		if (key.includes("has")) {
			option.textContent = "has";
		} else {
			option.textContent = key.split(":")[key.split(":").length - 1];
		}
		elementStateSelect.appendChild(option);
	}

	if (firstKey) {
		// console.log("firstKey", firstKey);
		updateElementInfo(firstKey, getElementFromPath(firstKey));
		global.id.elementSelect.value = global.variable.memoryElement;
		global.id.nameHelper.textContent = global.variable.memoryElement;
		global.id.editStateStyle.disabled = false;
	} else {
		global.id.editStateStyle.disabled = true;

		// const responsiveSelect = global.id.responsiveSelect;
		// responsiveSelect.innerHTML = "";
		// const option = document.createElement("option");
		// option.textContent = "any";
		// responsiveSelect.appendChild(option);
		// global.variable.style = "";
		// global.id.propertySelect.innerHTML = "";
		// global.id.propertyInput.value = "";
		// global.id.attributeSelect.innerHTML = "";
		// global.id.attributeInput.value = "";
	}
}
