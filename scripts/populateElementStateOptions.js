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
	const elementSelectValue = global.id.elementSelect.value;

	for (const [key, value] of currentMap) {
		if (
			key.includes(`${elementSelectValue}:`) ||
			key.includes(`${elementSelectValue}::`) ||
			key.includes(`${elementSelectValue}.`) ||
			key.includes(`${elementSelectValue}#`) ||
			key.replace(elementSelectValue, "").match(/^\s[a-z]/)
		) {
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
		} else if (key.startsWith(" ")) {
			option.textContent = key;
		} else {
			const splitKey = key.split(/[:.#]/);
			option.textContent = splitKey[splitKey.length - 1];
		}
		elementStateSelect.appendChild(option);
	}

	if (firstKey) {
		updateElementInfo(firstKey, getElementFromPath(firstKey));
		global.id.elementSelect.value = global.variable.memoryElement;
		global.id.nameHelper.textContent = global.variable.memoryElement;
		global.id.editStateStyle.disabled = false;
	} else {
		global.id.editStateStyle.disabled = true;
	}
}
