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
	console.log(keyInMapHasChildren);
	/** @type {Map<string,string>} */
	const mapContextual = new Map();
	for (const [key, value] of keyInMapHasChildren) {
		console.log("key", key);
		console.log("elementSelect:", global.id.elementSelect.value);
		console.log("blueprintSelect:", global.id.blueprintSelect.value);
		console.log(
			"both:",
			global.id.elementSelect.value + global.id.blueprintSelect.value,
		);
		const newKey = key.replace(`${global.id.elementSelect.value} > `, "");
		console.log("newKey", newKey);
		if (isBlueprint) {
			// const cleanedKey = newKey.replace(/^:nth-of-type\(\d+\)/g, "");
			const selectedBlueprintElementLength = global.id.blueprintSelect.value
				.replace(" > ", "")
				.split(">").length;
			const correctedKey = newKey
				.split(">")
				.slice(selectedBlueprintElementLength)
				.join(">");
			if (correctedKey) mapContextual.set(correctedKey);
			console.log(
				"selectedBlueprintElementLength",
				selectedBlueprintElementLength,
			);
		} else {
			mapContextual.set(newKey);
		}
		// if (newKey.includes("li:nth-of-type")) {
		// 	const cleanedKey = newKey.replace(/li:nth-of-type\(\d+\)/g, "li");
		// 	console.log("cleanedKey", cleanedKey);
		// 	mapContextual.set(cleanedKey, value);
		// } else {
		// 	mapContextual.set(newKey, value);
		// }
	}
	console.log(mapContextual);

	// for (const [key, value] of keyInMapHasChildren) {
	// 	const newKey = key.replace(
	// 		`${isBlueprint ? global.id.elementSelect.value + global.id.blueprintSelect.value : `${global.id.elementSelect.value} > `}`,
	// 		"",
	// 	);
	// 	mapContextual.set(newKey, value);
	// }
	console.log(mapContextual);
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
