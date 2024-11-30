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
  blueprintElementCounter = undefined
) {
  // Create the element
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  // Create the element with proper namespace handling
  let element;
  if (
    jsonObj.element === "svg" ||
    jsonObj.element === "path" ||
    jsonObj.element === "circle" ||
    jsonObj.element === "g"
  ) {
    element = document.createElementNS(SVG_NAMESPACE, jsonObj.element);
  } else {
    element = document.createElement(jsonObj.element);
  }
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
    const originalText = selectedJsonObj.text || jsonObj.text;
    element.cwrapText = originalText ?? "";

    if (originalText?.includes("cwrapSpan")) {
      const parts = originalText.split("cwrapSpan");
      element.textContent = parts[0];
      for (let i = 1; i < parts.length; i++) {
        const spanElement = document.createElement("span");
        //spanElement.setAttribute("data-cwrap-nest", "true");
        spanElement.isPlaceholder = true;
        element.isPlaceholderCarrier = true;
        element.appendChild(spanElement);
        element.append(parts[i]);
      }
    } else {
      element.textContent = originalText;
    }

    // Set additional attributes if specified in the JSON object
    if (selectedJsonObj.attributes) {
      for (const [key, value] of Object.entries(selectedJsonObj.attributes)) {
        element.setAttribute(key, value);
      }
    }
  }

  // Add a custom property if it is the initial load
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
        i + 1
      );
      const clonedElement = blueprintElement.cloneNode(true);
      clonedElement.customTag = "cwrapBlueprint";
      element.appendChild(clonedElement);
    }
  }

  // Add a click event listener to the element
  eventListenerClickElement(element);

  // Check if the JSON object has children elements
  if (selectedJsonObj.children) {
    let spanIndex = 0;
    const spanElements = element.querySelectorAll("span");
    // Iterate over each child element
    for (const child of jsonObj.children) {
      // Create the child element from the JSON object
      const childElement = createElementFromJson(
        child,
        isInitialLoad,
        blueprintElementCounter
      );
      // Append the child element to the parent element
      if (element.isPlaceholderCarrier && spanElements[spanIndex]) {
        spanElements[spanIndex].replaceWith(childElement);
        spanIndex++;
      } else {
        element.appendChild(childElement);
      }
    }
  }

  // Return the created element
  return element;
}
