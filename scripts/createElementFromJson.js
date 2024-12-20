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
 * @param {boolean} [isInitialLoad] - Flag indicating if this is the initial load.
 * @param {number} [blueprintElementCounter]
 * @param {Map} [properties]
 * @returns {HTMLElement} - The created DOM element.
 */
export default function createElementFromJson(
  jsonObj,
  isInitialLoad = undefined,
  blueprintElementCounter = undefined,
  properties = new Map() // Ensure properties is always initialized as a Map if not provided
) {
  // Create the element
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
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

    // Check if the text contains any of the special tags
    if (
      originalText?.includes("cwrapSpan") ||
      originalText?.includes("cwrapTemplate") ||
      originalText?.includes("cwrapProperty")
    ) {
      const parts = originalText.split(
        /(cwrapSpan|cwrapTemplate\[[^\]]*\]|cwrapProperty\[[^\]]*\])/g
      );
      const mergedParts = [];
      let tempPart = "";

      for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapSpan")) {
          if (tempPart) {
            mergedParts.push(tempPart);
            tempPart = "";
          }
          mergedParts.push(parts[i]);
        } else {
          tempPart += parts[i];
        }
      }
      if (tempPart) {
        mergedParts.push(tempPart);
      }

      // Process each part and handle cwrapSpan, cwrapTemplate, and cwrapProperty tags
      element.textContent = ""; // Clear the initial content before appending processed parts

      for (let i = 0; i < mergedParts.length; i++) {
        const part = mergedParts[i];

        if (part.startsWith("cwrapSpan")) {
          const spanElement = document.createElement("span");
          spanElement.isPlaceholder = true;
          element.isPlaceholderCarrier = true;
          element.appendChild(spanElement);
          element.append(part.replace("cwrapSpan", ""));
        } else if (part.startsWith("cwrapTemplate")) {
          const propMap = new Map(properties); // Create a new Map based on current properties

          const templateNameWithProps = part.match(
            /cwrapTemplate\[([^\]]+)\]/
          )[1];
          const templateName =
            templateNameWithProps.match(/.+(?=\()/)?.[0] ||
            templateNameWithProps;
          const templateProps =
            templateNameWithProps.match(/(?<=\().+(?=\))/)?.[0];

          if (templateProps) {
            const propsArray = templateProps.split(",");
            for (const prop of propsArray) {
              const [key, value] = prop.split("=");
              propMap.set(key, value);
            }
          }

          const templateElement = global.map.templatesMap.get(templateName);
          if (templateElement) {
            const clonedTemplateElement = createElementFromJson(
              templateElement,
              undefined,
              undefined,
              propMap // Pass the updated property map
            ).cloneNode(true);

            clonedTemplateElement.isTemplateElement = true;

            if (jsonObj.element === "cwrap-template") {
              clonedTemplateElement.isTemplateElementAnchor = true;
              clonedTemplateElement.templateElement = templateNameWithProps;
              element = clonedTemplateElement;
              jsonObj.templateName = true;
            } else {
              element.appendChild(clonedTemplateElement);
            }
          }
        } else if (part.startsWith("cwrapProperty")) {
          const propertyMatch = part.match(
            /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
          );
          if (propertyMatch) {
            const [property, defaultValue] = propertyMatch.slice(1);
            const mapValue = properties?.get(propertyMatch[1]);
            if (mapValue !== "cwrapPlaceholder") {
              element.append(mapValue || defaultValue);
            }
          }
        } else {
          element.append(part);
        }
      }
    } else {
      element.textContent = originalText;
    }

    // Set additional attributes if specified in the JSON object
    if (selectedJsonObj.attributes) {
      for (const [key, value] of Object.entries(selectedJsonObj.attributes)) {
        if (value === "cwrapOmit") continue;
        if (value.includes("cwrapProperty")) {
          const parts = value.split(/(cwrapProperty\[[^\]]+\])/g);
          let finalValue = "";

          for (const part of parts) {
            if (part.startsWith("cwrapProperty")) {
              const propertyMatch = part.match(
                /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
              );
              if (propertyMatch) {
                const [property, defaultValue] = propertyMatch.slice(1);
                const mapValue = properties?.get(property);
                finalValue += mapValue || defaultValue;
              }
            } else {
              finalValue += part;
            }
          }
          element.setAttribute(key, finalValue);
        } else {
          element.setAttribute(key, value);
        }
      }
    }
  }

  if (isInitialLoad && !jsonObj.blueprint) {
    element.customTag = "cwrapPreloaded";
  }

  let blueprintCounter = 0;
  function generateUniqueTimeStamp() {
    let timeStamp;
    do {
      blueprintCounter += 1;
      timeStamp = `bpm${blueprintCounter}`;
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
        properties // Pass properties here
      );
      const clonedElement = blueprintElement.cloneNode(true);
      clonedElement.customTag = "cwrapBlueprint";
      element.appendChild(clonedElement);
    }
  }

  eventListenerClickElement(element);

  if (selectedJsonObj.children) {
    let spanIndex = 0;
    const spanElements = element.querySelectorAll("span");
    for (const child of jsonObj.children) {
      const childElement = createElementFromJson(
        child,
        isInitialLoad,
        blueprintElementCounter,
        properties // Pass properties here
      );
      if (element.isPlaceholderCarrier && spanElements[spanIndex]) {
        spanElements[spanIndex].replaceWith(childElement);
        spanIndex++;
      } else if (!childElement.isOmitted) {
        element.appendChild(childElement);
      }
    }
  }

  if (jsonObj.element === "cwrap-template" && jsonObj.passover) {
    const passoverElement = element.querySelector("cwrap-passover");
    if (passoverElement) {
      for (const childJson of jsonObj.passover) {
        const childElement = createElementFromJson(
          childJson,
          isInitialLoad,
          blueprintElementCounter,
          properties // Pass properties here
        );
        passoverElement.before(childElement);
      }
      passoverElement.remove();
    }
  }

  return element;
}
