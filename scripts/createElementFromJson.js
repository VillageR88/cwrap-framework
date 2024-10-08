import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import validateParentElement from "./validateParentElement.js";
import validateRemoveElement from "./validateRemoveElement.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateAttributeOptionsValue from "./populateAttributeOptionsValue.js";
import getElementFromPath from "./getElementFromPath.js";

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
	element.addEventListener("click", (event) => {
		console.log("Clicked on an element:", element); // Log the click event

		if (
			global.id.mainStateSelector.style.display === "flex" ||
			global.id.mainStateAdd.style.display === "flex"
		)
			return; // Do nothing if some elements are displayed like state
		event.stopPropagation();
		event.preventDefault();
		if (event.target.tagName === "A") {
			console.log("a element");
			window.location.href = event.target.href;
		}

		const fullPath = getElementPath(element);
		updateElementInfo(fullPath, element);
		validateParentElement();
		validateRemoveElement();
		if (global.id.mainAttributeSelector.style.display === "flex") {
			populateAttributeOptions();
			populateAttributeOptionsValue();
		} else if (global.id.mainTextEditor.style.display === "flex") {
			console.log("mainTextEditor");
			const element = getElementFromPath();
			const textContent = Array.from(element.childNodes)
				.filter((node) => node.nodeType === Node.TEXT_NODE)
				.map((node) => node.nodeValue.trim())
				.join(" ");

			global.id.mainTextEditor2.value = textContent;
		}
	});

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
