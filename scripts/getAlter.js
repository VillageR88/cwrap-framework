/**
 * @type {import('./_globals.js')}
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
import getElementFromPath from "./getElementFromPath.js";

/**
 *
 * @returns {{alterSelectedValue: string | undefined, alterSelectedReference: JsonObject | null}}
 */
export default function getAlter() {
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
	/** @type {string | undefined} */
	let alterSelectedValue;
	/** @type {JsonObject | null} */
	let alterSelectedReference = null;

	for (const elementName of selectedBlueprintElementValueArray) {
		/** @type {string} */
		const elementNameTag = elementName.split(":")[0];
		const elementNameOrdinal =
			Number(elementName.match(regexNthOfTypeOrdinal)?.[0]) || 0;
		processedJson = getJsonElement(
			processedJson,
			elementNameTag,
			elementNameOrdinal,
		);
	}

	/**
	 *
	 * @param {JsonObject} jsonMap
	 * @param {string} elementNameTag
	 * @param {number} elementNameOrdinal
	 * @returns {JsonObject | null}
	 */
	function getJsonElement(jsonMap, elementNameTag, elementNameOrdinal) {
		let index = 1;
		for (const item of jsonMap.children.filter(
			(item) => item.element === elementNameTag,
		)) {
			if (item.alter) {
				alterSelectedValue = item.alter;
				alterSelectedReference = item;
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
		return null;
	}

	return { alterSelectedValue, alterSelectedReference };
}
