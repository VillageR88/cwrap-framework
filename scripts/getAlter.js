/**
 * @type {import('./_globals.js')}
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
import getElementFromPath from "./getElementFromPath.js";

/**
 *
 * @returns {{alterSelectedValue: string | undefined, alterSelectedReference: JsonObject | null, enumReference: JsonObject | null}}
 */
export default function getAlter() {
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	const ordinalNth = global.id.mainBlueprintAlterSelectorSelectOrdinal.value;
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
	/** @type {JsonObject | null} */
	let enumReference = null;
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
				for (const enumElement of item.enum) {
					if (Number(enumElement.nth) === Number(ordinalNth)) {
						enumReference = enumElement;
					}
				}
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

	return { alterSelectedValue, alterSelectedReference, enumReference };
}
