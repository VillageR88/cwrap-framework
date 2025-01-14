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
      elementNameOrdinal
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
    let foundElement = null;
    for (const item of jsonMap.children.filter(
      (item) => item.element === elementNameTag
    )) {
      if (!item.alter) {
        item.alter = "partial";
      }
      if (item.alter) {
        alterSelectedValue = item.alter;
        alterSelectedReference = item;
        if (!item.enum) {
          item.enum = [];
        }
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
        foundElement = item;
        break;
      }
      index++;
    }

    if (!foundElement) {
      // Create the missing element
      const newElement = {
        element: elementNameTag,
        children: [],
        enum: [],
      };
      jsonMap.children.push(newElement);
      foundElement = newElement;
    }

    // Ensure alterSelectedReference is set if it was not found in the loop
    if (!alterSelectedReference) {
      alterSelectedReference = foundElement;
    }

    // Ensure enum array exists
    if (!alterSelectedReference.enum) {
      alterSelectedReference.enum = [];
    }

    // Ensure enum keys exist with empty values
    const requiredEnumKeys = ["nth", "style", "text", "attributes"];
    for (const enumElement of alterSelectedReference.enum) {
      for (const key of requiredEnumKeys) {
        if (!Object.prototype.hasOwnProperty.call(enumElement, key)) {
          enumElement[key] = key === "attributes" ? {} : "";
        }
      }
    }

    return foundElement.children;
  }

  return { alterSelectedValue, alterSelectedReference, enumReference };
}