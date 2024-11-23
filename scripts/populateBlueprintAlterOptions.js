import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintAlterOptions() {
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	const selectedElementValue = global.id.elementSelect.value;
	const selectedBlueprintElementValue = global.id.blueprintSelect.value;
	const regexNthOfTypeOrdinal = /(?<=nth-of-type\()\d+/;
	/** @type {string[]} */
	const selectedBlueprintElementValueArray = selectedBlueprintElementValue
		.split(" > ")
		.filter(Boolean)
		.slice(1);
	let processedJson = currentMap;
	let alterSelectedValue;
	for (const elementName of selectedBlueprintElementValueArray) {
		const elementNameTag = elementName.split(":")[0];
		const elementNameOrdinal =
			Number(elementName.match(regexNthOfTypeOrdinal)?.[0]) || 0;
		processedJson = getJsonElement(
			processedJson,
			elementNameTag,
			elementNameOrdinal,
		);
	}

	function getJsonElement(jsonMap, elementNameTag, elementNameOrdinal) {
		let index = 1;
		for (const item of jsonMap.children.filter(
			(item) => item.element === elementNameTag,
		)) {

			if (item.alter) {
				alterSelectedValue = item.alter;
				break;
			}
			if (
				item.element === elementNameTag &&
				index === elementNameOrdinal &&
				item.children
			) {
				return item.children;
			}
			index++;
		}
	}

	global.id.mainBlueprintAlterSelectorSelectAlter.innerHTML = "";
	for (const type of ["full", "partial", "none"]) {
		const option = document.createElement("option");
		option.value = type;
		option.textContent = type;
		global.id.mainBlueprintAlterSelectorSelectAlter.append(option);
	}
	global.id.mainBlueprintAlterSelectorSelectAlter.value = alterSelectedValue;
}
