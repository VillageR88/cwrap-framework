import resolveToggleContext from "./resolveToggleContext.js";
import { stateNonContextual, stateContextual } from "./_const.js";

/**
 *
 * @param {Map<string,string>} cssMap
 * @param {Map<string,string>} mediaQueriesMap
 */
export default function populateStateSelectAllOptions(isBlueprint = false) {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	/** @type {Map<string,string>} */
	const mapIncludesKey = new Map();
	for (const [key, value] of cssMap) {
		if (key.includes(":has") || key.includes(":hover")) continue;
		if (key.includes(global.id.elementSelect.value))
			mapIncludesKey.set(key, value);
	}
	/** @type {Map<string,string>} */
	const keyInMapHasChildren = new Map();
	for (const [key, value] of mapIncludesKey) {
		if (key.replace(global.id.elementSelect.value, "").includes(">")) {
			keyInMapHasChildren.set(key, value);
		}
	}
	/** @type {Map<string,string>} */
	const mapContextual = new Map();
	for (const [key, value] of keyInMapHasChildren) {
		const newKey = key.replace(`${global.id.elementSelect.value} > `, "");
		if (isBlueprint) {
			const selectedBlueprintElementLength = global.id.blueprintSelect.value
				.replace(" > ", "")
				.split(">").length;
			const correctedKey = newKey
				.split(">")
				.slice(selectedBlueprintElementLength)
				.join(">");
			if (correctedKey) mapContextual.set(correctedKey);
		} else {
			mapContextual.set(newKey);
		}
	}
	const stateSelectAll = isBlueprint
		? global.id.stateBlueprintSelectAll
		: global.id.stateSelectAll;
	const memoryStateSelectAllValue = stateSelectAll.value;
	stateSelectAll.innerHTML = "";
	for (const element of stateNonContextual) {
		const option = document.createElement("option");
		option.value = element;
		option.textContent = element;
		stateSelectAll.appendChild(option);
	}
	for (const element of stateContextual) {
		const option = document.createElement("option");
		option.value = element;
		option.textContent = element;
		stateSelectAll.appendChild(option);
	}
	const option = document.createElement("option");
	option.value = "custom";
	option.textContent = "custom";
	stateSelectAll.appendChild(option);
	stateSelectAll.value = memoryStateSelectAllValue || stateSelectAll.value;
	global.id.mainStateAddCustomInput.value = "";
	resolveToggleContext(mapContextual, isBlueprint);
}
