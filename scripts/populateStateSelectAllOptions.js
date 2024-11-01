import resolveToggleContext from "./resolveToggleContext.js";
import { stateNonContextual, stateContextual } from "./_const.js";

/**
 *
 * @param {Map<string,string>} cssMap
 * @param {Map<string,string>} mediaQueriesMap
 */
export default function populateStateSelectAllOptions(isBlueprint = false) {
	const cssMap = global.map.cssMap;
	console.log("cssMap", cssMap);
	const mediaQueriesMap = global.map.mediaQueriesMap;
	// const stateOfText = global.id.elementSelect.value.split(" > ")[0];
	/** @type {Map<string,string>}  */
	const statelessCssMap = new Map();
	for (const [key, value] of cssMap) {
		if (key.includes(":has") || key.includes(":hover")) continue;
		statelessCssMap.set(key, value);
	}
	/** @type {Map<string,string>} */
	const mapIncludesKey = new Map();
	for (const [key, value] of statelessCssMap) {
		if (key.includes(global.variable.memoryElement))
			mapIncludesKey.set(key, value);
	}
	/** @type {Map<string,string>} */
	const keyInMapHasChildren = new Map();
	for (const [key, value] of mapIncludesKey) {
		if (key.replace(global.variable.memoryElement, "").includes(">")) {
			keyInMapHasChildren.set(key, value);
		}
	}
	/** @type {Map<string,string>} */
	const mapContextual = new Map();
	for (const [key, value] of keyInMapHasChildren) {
		const newKey = key.replace(`${global.id.elementSelect.value} > `, "");
		if (newKey.includes("body")) continue;
		if (newKey.includes("li:nth-of-type")) {
			const cleanedKey = newKey.replace(/li:nth-of-type\(\d+\)/g, "li");
			mapContextual.set(cleanedKey, value);
		} else {
			mapContextual.set(newKey, value);
		}
	}

	for (const [key, value] of keyInMapHasChildren) {
		const newKey = key.replace(`${global.id.elementSelect.value} > `, "");
		if (newKey.includes("body")) continue;
		mapContextual.set(newKey, value);
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
	stateSelectAll.value = memoryStateSelectAllValue || stateSelectAll.value;
	console.log(mapContextual);
	resolveToggleContext(mapContextual, isBlueprint);
}
