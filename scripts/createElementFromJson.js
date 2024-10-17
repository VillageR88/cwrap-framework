
import eventListenerClickElement from "./eventListenerClickElement.js";

/**
 * Creates a DOM element from the provided JSON object and adds it to the preview document (iframe).
 *
 * @param {Object} jsonObj - The JSON object representing the element.
 * @param {Document} doc - The document object to create the element in.
 * @returns {HTMLElement} - The created DOM element.
 */
export default function createElementFromJson(jsonObj) {
	// Create the element
	const element = document.createElement(jsonObj.element); // RETHINK

	// Set the element's ID if specified in the JSON object
	if (jsonObj.id) element.id = jsonObj.id;

	// Set the element's text content if specified in the JSON object
	if (jsonObj.text) element.textContent = jsonObj.text;

	// Set additional attributes if specified in the JSON object
	if (jsonObj.attributes) {
		for (const [key, value] of Object.entries(jsonObj.attributes)) {
			element.setAttribute(key, value);
		}
	}

	// Add a click event listener to the element
	eventListenerClickElement(element);

	// Check if the JSON object has children elements
	if (jsonObj.children) {
		// Iterate over each child element
		for (const child of jsonObj.children) {
			// Create the child element from the JSON object
			const childElement = createElementFromJson(child);
			// Append the child element to the parent element
			element.appendChild(childElement);
		}
	}

	// Return the created element
	return element;
}
