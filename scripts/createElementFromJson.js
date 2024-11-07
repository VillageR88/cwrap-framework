import eventListenerClickElement from "./eventListenerClickElement.js";
import {
	replacePlaceholdersCwrapIndex,
	replacePlaceholdersCwrapArray,
} from "./replaceBlueprintJsonPlaceholders.js";

/**
 * Replaces placeholders in the JSON object with the specified value.
 *
 * @param {Object} jsonObj - The JSON object to process.
 * @param {string} placeholder - The placeholder to replace.
 * @param {number} index - The index to replace the placeholder with.
 * @returns {Object} - The processed JSON object with placeholders replaced.
 */

/**
 * Creates a DOM element from the provided JSON object and adds it to the preview document (iframe).
 *
 * @param {Object} jsonObj - The JSON object representing the element.
 * @param {boolean} isInitialLoad - Flag indicating if this is the initial load.
 * @returns {HTMLElement} - The created DOM element.
 */
export default function createElementFromJson(jsonObj, isInitialLoad) {
	// Create the element
	const element = document.createElement(jsonObj.element);

	// Set the element's text content if specified in the JSON object
	if (jsonObj.text) element.textContent = jsonObj.text;

	// Set additional attributes if specified in the JSON object
	if (jsonObj.attributes) {
		for (const [key, value] of Object.entries(jsonObj.attributes)) {
			element.setAttribute(key, value);
		}
	}

	// // Set the element's style if specified in the JSON object
	// if (jsonObj.style) {
	// 	element.style.cssText = jsonObj.style;
	// }

	// Add a custom property if it is the initial load
	if (isInitialLoad && !jsonObj.blueprint) {
		element.customTag = "cwrapPreloaded";
	}

	// Handle blueprint property
	if (jsonObj.blueprint) {
		element.customTag = "cwrapBlueprintContainer";
		const timeStamp = new Date().getTime();
		element.timeStamp = timeStamp;
		global.map.blueprintMap.set(timeStamp, jsonObj.blueprint);
		const count = jsonObj.blueprint.count;
		for (let i = 0; i < count; i++) {
			const blueprintJson = replacePlaceholdersCwrapArray(jsonObj.blueprint, i);
			//blueprintJson = replacePlaceholdersCwrapArray(blueprintJson, i);
			const blueprintElement = createElementFromJson(
				blueprintJson,
				isInitialLoad,
			);
			const clonedElement = blueprintElement.cloneNode(true);
			clonedElement.customTag = "cwrapBlueprint";
			element.appendChild(clonedElement);
		}
	}

	// Add a click event listener to the element
	eventListenerClickElement(element);

	// Check if the JSON object has children elements
	if (jsonObj.children) {
		// Iterate over each child element
		for (const child of jsonObj.children) {
			// Create the child element from the JSON object
			const childElement = createElementFromJson(child, isInitialLoad);
			// Append the child element to the parent element
			element.appendChild(childElement);
		}
	}

	// Return the created element
	return element;
}
