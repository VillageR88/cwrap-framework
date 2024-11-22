/**
 * @type {import('./_globals.js')}
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
import eventListenerClickElement from "./eventListenerClickElement.js";
import {
	replacePlaceholdersCwrapIndex,
	replacePlaceholdersCwrapArray,
} from "./replaceBlueprintJsonPlaceholders.js";

/**
 * Creates a DOM element from the provided JSON object and adds it to the preview document (iframe).
 *
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {boolean} isInitialLoad - Flag indicating if this is the initial load.
 * @param {number} blueprintElementCounter
 * @returns {HTMLElement} - The created DOM element.
 */
export default function createElementFromJson(
	jsonObj,
	isInitialLoad,
	blueprintElementCounter = undefined,
) {
	// Create the element
	const element = document.createElement(jsonObj.element);
	let selectedJsonObj = jsonObj;

	function setJsonObjToEnumItem() {
		for (const enumItem of jsonObj.enum) {
			if (blueprintElementCounter === Number(enumItem.nth)) {
				selectedJsonObj = enumItem;
				return false;
			}
		}
		return true;
	}
	let abandonItem = false;
	switch (jsonObj.alter) {
		case "none":
			break;
		case "partial":
			setJsonObjToEnumItem();
			break;
		case "full":
			abandonItem = setJsonObjToEnumItem();
			break;
	}
	// Set the element's text content if specified in the JSON object
	if (!abandonItem) {
		if (selectedJsonObj.text) element.textContent = selectedJsonObj.text;

		// Set additional attributes if specified in the JSON object
		if (selectedJsonObj.attributes) {
			for (const [key, value] of Object.entries(selectedJsonObj.attributes)) {
				element.setAttribute(key, value);
			}
		}
	}

	// Add a custom property if it is the initial load // TODO: Validate this
	if (isInitialLoad && !jsonObj.blueprint) {
		element.customTag = "cwrapPreloaded";
	}

	let blueprintCounter = 0;
	function generateUniqueTimeStamp() {
		let timeStamp;
		do {
			blueprintCounter += 1;
			timeStamp = `bpm${blueprintCounter}`; // Create index-based value with "bpm"
		} while (global.map.blueprintMap.has(timeStamp));
		return timeStamp;
	}

	if (jsonObj.blueprint) {
		element.customTag = "cwrapBlueprintContainer";
		const timeStamp = generateUniqueTimeStamp();
		element.timeStamp = timeStamp;
		global.map.blueprintMap.set(timeStamp, jsonObj.blueprint);

		const count = jsonObj.blueprint.count;
		for (let i = 0; i < count; i++) {
			let cookedJson = replacePlaceholdersCwrapArray(jsonObj.blueprint, i);
			cookedJson = replacePlaceholdersCwrapIndex(cookedJson, i);
			const blueprintElement = createElementFromJson(
				cookedJson,
				isInitialLoad,
				i + 1,
			);
			const clonedElement = blueprintElement.cloneNode(true);
			clonedElement.customTag = "cwrapBlueprint";
			console.log(clonedElement);
			element.appendChild(clonedElement);
		}
	}

	// Add a click event listener to the element
	eventListenerClickElement(element);
	// Check if the JSON object has children elements
	if (selectedJsonObj.children) {
		// Iterate over each child element
		for (const child of jsonObj.children) {
			// Create the child element from the JSON object
			const childElement = createElementFromJson(
				child,
				isInitialLoad,
				blueprintElementCounter,
			);
			// Append the child element to the parent element
			element.appendChild(childElement);
		}
	}

	// Return the created element
	return element;
}
