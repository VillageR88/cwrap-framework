/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */

import {
  replacePlaceholdersCwrapIndex,
  replacePlaceholdersCwrapArray,
} from "./replaceBlueprintJsonPlaceholders.js";
import { notNthEnumerableElements } from "./_const.js";

/**
 * Creates cssMap and mediaQueriesMap.
 * Generates a CSS selector string based on the provided JSON object with example outcome: "body > main> div:nth-of-type(1)"
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 * @param {number} [blueprintCounter]
 * @param {Map} [propsMap=new Map()] - A Map to keep track of properties.
 * @param {JsonObject[]} [passover] - The passover elements to insert.
 */
export default function generateCssSelector(
  jsonObj,
  parentSelector = "",
  siblingCountMap = new Map(),
  blueprintCounter = undefined,
  propsMap = new Map(),
  passover = [],
  omit = []
) {
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;

  let selector = parentSelector;

  if (jsonObj.element) {
    if (omit.includes(jsonObj["omit-id"])) {
      return;
    }
    const element = jsonObj.element;
    if (!jsonObj.text) jsonObj.text = "";

    // Handle cwrap-template elements
    if (element === "cwrap-template") {
      const parts = jsonObj.text.split(/(cwrapTemplate\[[^\]]+\])/);
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapTemplate")) {
          const templateNameWithProps = parts[i].match(
            /cwrapTemplate\[([^\]]+)\]/
          )[1];
          const templateName =
            templateNameWithProps.match(/.+(?=\()/)?.[0] ||
            templateNameWithProps;
          const templatePropsMap = propsMap;
          const propsMatch = templateNameWithProps.match(/\(([^)]+)\)/);

          if (propsMatch) {
            const props = propsMatch[1].split(",");
            for (const prop of props) {
              const [key, value] = prop.split("=");
              templatePropsMap.set(key.trim(), value.trim());
            }
          }

          const templateElement = global.map.templatesMap.get(templateName);
          if (templateElement) {
            // Create a deep copy of the template element
            const templateElementCopy = JSON.parse(
              JSON.stringify(templateElement)
            );
            for (const [key, value] of templatePropsMap) {
              if (propsMap.has(key)) {
                templatePropsMap.set(key, propsMap.get(key));
              }
            }

            generateCssSelector(
              templateElementCopy,
              selector,
              siblingCountMap,
              blueprintCounter,
              templatePropsMap,
              jsonObj?.passover || passover || [],
              jsonObj?.omit || omit || []
            );
          }
          return;
        }
      }
    }

    // Handle cwrap-passover elements
    if (element === "cwrap-passover") {
      for (const childJson of passover) {
        generateCssSelector(
          childJson,
          parentSelector,
          siblingCountMap,
          blueprintCounter,
          propsMap,
          passover,
          omit
        );
      }
      return;
    }

    // Initialize sibling counts for the parent selector
    if (!siblingCountMap.has(parentSelector)) {
      siblingCountMap.set(parentSelector, new Map());
    }
    const parentSiblingCount = siblingCountMap.get(parentSelector);

    if (notNthEnumerableElements.includes(element)) {
      selector += (parentSelector ? " > " : "") + element;
    } else {
      if (!parentSiblingCount.has(element)) {
        parentSiblingCount.set(element, 0);
      }
      parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);
      selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(
        element
      )})`;
    }

    if (jsonObj.text) {
      if (jsonObj.text.includes("cwrapProperty")) {
        const parts = jsonObj.text.split(/(cwrapProperty\[[^\]]+\])/);
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith("cwrapProperty")) {
            const propertyMatch = parts[i].match(
              /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
            );
            if (propertyMatch) {
              const [property, defaultValue] = propertyMatch.slice(1);
              const mapValue = propsMap.get(property);
              if (mapValue?.includes("cwrapOmit")) {
                return;
              }
            }
          }
        }
      }
    }

    // Handle styles with cwrapProperty
    if (jsonObj.style) {
      if (jsonObj.style.includes("cwrapProperty")) {
        const parts = jsonObj.style.split(/(cwrapProperty\[[^\]]+\])/);
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith("cwrapProperty")) {
            const propertyMatch = parts[i].match(
              /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
            );
            if (propertyMatch) {
              const [property, defaultValue] = propertyMatch.slice(1);
              const mapValue = propsMap.get(property);
              jsonObj.style = jsonObj.style.replace(
                parts[i],
                mapValue || defaultValue
              );
            }
          }
        }
      }

      // Check if the final style contains cwrapOmit
      if (jsonObj.style.includes("cwrapOmit")) {
        return;
      }

      if (
        jsonObj.enum?.[blueprintCounter - 1]?.style &&
        jsonObj.alter !== "none"
      ) {
        cssMap.set(selector, jsonObj.enum[blueprintCounter - 1].style);
      } else {
        cssMap.set(selector, jsonObj.style);
      }
    } else {
      cssMap.set(selector, "");
    }

    // Handle extensions
    if (jsonObj.extend) {
      for (const extension of jsonObj.extend) {
        const extendedSelector = `${selector}${extension.extension}`;
        cssMap.set(extendedSelector, extension.style);
      }
    }

    // Handle media queries
    if (jsonObj.mediaQueries) {
      for (const mediaQuery of jsonObj.mediaQueries) {
        if (!mediaQueriesMap.has(mediaQuery.query)) {
          mediaQueriesMap.set(mediaQuery.query, new Map());
        }
        mediaQueriesMap.get(mediaQuery.query).set(selector, mediaQuery.style);
      }
    }

    // Recursively process children
    if (jsonObj.children) {
      for (const child of jsonObj.children) {
        generateCssSelector(
          child,
          selector,
          siblingCountMap,
          blueprintCounter,
          propsMap,
          passover,
          omit
        );
      }
    }

    // Handle blueprints
    if (jsonObj.blueprint) {
      jsonObj.customTag = "cwrapBlueprintCSS";
      const blueprint = jsonObj.blueprint;
      for (let i = 0; i < blueprint.count; i++) {
        const blueprintChild = JSON.parse(JSON.stringify(blueprint));
        blueprintChild.element = blueprint.element;
        blueprintChild.children = blueprint.children;
        const cookedBlueprintChild = replacePlaceholdersCwrapArray(
          replacePlaceholdersCwrapIndex(blueprintChild, i),
          i
        );
        generateCssSelector(
          cookedBlueprintChild,
          selector,
          siblingCountMap,
          i + 1,
          propsMap,
          passover,
          omit
        );
      }
    }
  }
}
