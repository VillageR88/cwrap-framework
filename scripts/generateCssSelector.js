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
 * @todo Evaluate alternative: this function store all selector including blueprint selectors with additional customTag property.
 */
export default function generateCssSelector(
  jsonObj,
  parentSelector = "",
  siblingCountMap = new Map(),
  blueprintCounter = undefined
) {
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;
  // Start with the parent selector
  let selector = parentSelector;
  if (jsonObj.element) {
    const element = jsonObj.element;
    if (!jsonObj.text) jsonObj.text = "";
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
          const templateElement = global.map.templatesMap.get(templateName);
          if (templateElement) {
            generateCssSelector(
              templateElement,
              selector,
              siblingCountMap,
              blueprintCounter
            );
          }
          return;
        }
      }
    }

    // Initialize sibling count map for the parent selector if not already present
    if (!siblingCountMap.has(parentSelector)) {
      siblingCountMap.set(parentSelector, new Map());
    }
    const parentSiblingCount = siblingCountMap.get(parentSelector);

    if (notNthEnumerableElements.some((item) => item === element)) {
      selector += (parentSelector ? " > " : "") + element;
    } else {
      // Initialize sibling count for the element if not already present
      if (!parentSiblingCount.has(element)) {
        parentSiblingCount.set(element, 0);
      }
      // Increment the sibling count for the element
      parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);

      // Append the element and its nth-of-type pseudo-class to the selector
      selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(
        element
      )})`;
    }
    if (
      jsonObj.enum?.[blueprintCounter - 1]?.style &&
      jsonObj.alter !== "none"
    ) {
      cssMap.set(selector, jsonObj.enum[blueprintCounter - 1]?.style);
    } else if (jsonObj.style) {
      // I have changed this from     } else if (jsonObj.style && jsonObj.customTag !== "cwrapBlueprintCSS") { because it corrects previous commit which
      //not added correctly ul to template generated blueprint element, but i don't remember cause of adding jsonObj.customTag !== "cwrapBlueprintCSS". Probably need to monitor functioning after change
      cssMap.set(selector, jsonObj.style);
    } else {
      cssMap.set(selector, "");
    }

    // Handle extensions if present in the JSON object
    if (jsonObj.extend) {
      for (const extension of jsonObj.extend) {
        // Generate the extended selector
        const extendedSelector = `${selector}${extension.extension}`;
        // Store the extended style in the cssMap
        cssMap.set(extendedSelector, extension.style);
      }
    }

    // Check if the JSON object has media queries
    if (jsonObj.mediaQueries) {
      // Iterate over each media query
      for (const mediaQuery of jsonObj.mediaQueries) {
        // Create a media query selector
        const mediaQuerySelector = `${selector}`;
        // Initialize the media query map if not already present
        if (!mediaQueriesMap.has(mediaQuery.query)) {
          mediaQueriesMap.set(mediaQuery.query, new Map());
        }
        // Store the media query style in the mediaQueriesMap
        mediaQueriesMap
          .get(mediaQuery.query)
          .set(mediaQuerySelector, mediaQuery.style);
      }
    }

    // Check if the JSON object has children elements
    if (jsonObj.children) {
      // Recursively generate CSS selectors for each child element
      for (const child of jsonObj.children) {
        generateCssSelector(child, selector, siblingCountMap, blueprintCounter);
      }
    }

    // Handle blueprint property
    if (jsonObj.blueprint) {
      jsonObj.customTag = "cwrapBlueprintCSS";
      const blueprint = jsonObj.blueprint;
      for (let i = 0; i < blueprint.count; i++) {
        const blueprintChild = JSON.parse(JSON.stringify(blueprint));
        blueprintChild.element = blueprint.element;
        blueprintChild.children = blueprint.children;
        //blueprintChild.customTag = "cwrapBlueprintCSS"; //commenting this house fix the issue (not sure why) with the blueprint elements not being added to the cssMap on the first load
        let cookedBLueprintChild = replacePlaceholdersCwrapIndex(
          blueprintChild,
          i
        );
        cookedBLueprintChild = replacePlaceholdersCwrapArray(
          cookedBLueprintChild,
          i
        );

        generateCssSelector(
          cookedBLueprintChild,
          selector,
          siblingCountMap,
          i + 1
        );
      }
    }

    // Handle cwrapTemplate property
    if (jsonObj.text?.includes("cwrapTemplate")) {
      const parts = jsonObj.text.split(/(cwrapTemplate\[[^\]]+\])/);
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapTemplate")) {
          const templateNameWithProps = parts[i].match(
            /cwrapTemplate\[([^\]]+)\]/
          )[1];
          const templateName =
            templateNameWithProps.match(/.+(?=\()/)?.[0] ||
            templateNameWithProps;
          const templateElement = global.map.templatesMap.get(templateName);
          if (templateElement) {
            generateCssSelector(
              templateElement,
              selector,
              siblingCountMap,
              blueprintCounter
            );
          }
        }
      }
    }
  }
}
