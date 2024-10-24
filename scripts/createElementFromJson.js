import eventListenerClickElement from "./eventListenerClickElement.js";

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

    // Add a custom property if it is the initial load
    if (isInitialLoad) {
        element.customTag = "cwrapTemp";
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