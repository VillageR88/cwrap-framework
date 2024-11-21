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
		const match = key.match(
			/(?!>)\S\s(\S+)$|(?!:nth-of-type\(\d+\))([:.#]\S+)/,
		);
		if (match) {
			console.log("matched");
			if (!firstKey) firstKey = key;
			optionsMap.set(key);
		}
	}
	console.log("optionsMap", optionsMap);
	// (?!>)\S+\s(\S+)$
	elementStateSelect.innerHTML = "";
	for (const [key, _] of optionsMap) {
		console.log("key1", key);

		const option = document.createElement("option");
		option.value = key;
		const match = key.match(
			/(?!>)\S\s(\S+)$|(?!:nth-of-type\(\d+\))([:.#]\S+)/,
		);
		option.textContent = match?.[1] ?? match?.[2];
		console.log("ttthis key", key);
		option.value = key;

		elementStateSelect.appendChild(option);
	}

	if (firstKey) {
		console.log("is first key");
		console.log(firstKey);
		updateElementInfo(firstKey, getElementFromPath(firstKey));
		global.id.elementStateSelect.value = firstKey;
		global.id.elementSelect.value = global.variable.memoryElement;
		global.id.nameHelper.textContent = global.variable.memoryElement;
		global.id.editStateStyle.disabled = false;
	} else {
		console.log("no first key");
		global.id.editStateStyle.disabled = true;
	}
}
