import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";

/**
 * Creates a DOM element from the provided JSON object and adds it to the preview document (iframe).
 *
 * @param {Object} jsonObj - The JSON object representing the element.
 * @param {Document} doc - The document object to create the element in.
 * @param {Map} cssMap - The Map object containing CSS selectors and styles.
 * @param {Map} mediaQueriesMap - The Map object containing media queries and styles.
 * @returns {HTMLElement} - The created DOM element.
 */
export default function createElementFromJson(
  jsonObj,
  doc,
  cssMap,
  mediaQueriesMap
) {
  // Create the element
  const element = doc.createElement(jsonObj.element);

  // Set the element's ID if specified in the JSON object
  if (jsonObj.id) element.id = jsonObj.id;

  // Set the element's class if specified in the JSON object
  if (jsonObj.class) element.className = jsonObj.class;

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
    const elementStateDiv = document.getElementById("elementStateDiv");
    if (elementStateDiv.style.display === "flex") return; // Do nothing if some elements are displayed like state
    event.stopPropagation();
    // Get the full path of the element
    const fullPath = getElementPath(element);
    // Update the element information based on the full path
    updateElementInfo(fullPath, element, cssMap, mediaQueriesMap);
  });

  // Check if the JSON object has children elements
  if (jsonObj.children) {
    // Iterate over each child element
    for (const child of jsonObj.children) {
      // Create the child element from the JSON object
      const childElement = createElementFromJson(
        child,
        doc,
        cssMap,
        mediaQueriesMap
      );
      // Append the child element to the parent element
      element.appendChild(childElement);
    }
  }

  // Return the created element
  return element;
}
