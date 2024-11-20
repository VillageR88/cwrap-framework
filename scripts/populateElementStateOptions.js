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
		console.log("key", key);
		console.log("elementSelectValue", elementSelectValue);
		console.log("replacement");
		console.log(key.replace(elementSelectValue, ""));

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
	console.log("optionsMap", optionsMap);

	elementStateSelect.innerHTML = "";
	for (const [key, _] of optionsMap) {
		console.log("breakpoint");
		console.log("key", key);
		const option = document.createElement("option");
		option.value = key;
		console.log("key", key);
		if (key.includes("has")) {
			option.textContent = "has";
		} else if (key.startsWith(" ")) {
			// Handle leading whitespace case
			console.log("case where empty space at start");
			option.textContent = key;
		} else {
			console.log("case where :.#");
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
