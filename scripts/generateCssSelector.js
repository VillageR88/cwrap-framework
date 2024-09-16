/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Generates a CSS selector string based on the provided JSON object.
 * Example output: "body > main:nth-of-type(1) > section:nth-of-type(2).container"
 * This function runs only once with loadPreview.js.
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [cssMap=new Map()] - A Map to store CSS styles.
 * @param {Map} [mediaQueriesMap=new Map()] - A Map to store media query styles.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 * @param {Map} [fontMap=new Map()] - A Map to store font styles.
 * @param {Map} [rootMap=new Map()] - A Map to store root styles.
 */
export default function generateCssSelector(
  jsonObj,
  parentSelector = "",
  cssMap = new Map(),
  mediaQueriesMap = new Map(),
  siblingCountMap = new Map()
) {
  // Start with the parent selector
  let selector = parentSelector;

  if (jsonObj.element) {
    const element = jsonObj.element;

    // Initialize sibling count map for the parent selector if not already present
    if (!siblingCountMap.has(parentSelector)) {
      siblingCountMap.set(parentSelector, new Map());
    }
    const parentSiblingCount = siblingCountMap.get(parentSelector);

    // Handle special elements like 'body', 'main', and 'footer'
    if (element === "body" || element === "main" || element === "footer") {
      selector += (parentSelector ? " > " : "") + element;

      // Append class if present in the JSON object
      if (jsonObj.class) {
        selector += `.${jsonObj.class}`;
      }
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

      // Append class if present in the JSON object
      if (jsonObj.class) {
        selector += `.${jsonObj.class}`;
      }
    }
    // Store the style in the cssMap if present in the JSON object
    if (jsonObj.style) {
      cssMap.set(selector, jsonObj.style);
    }

    // Handle extensions if present in the JSON object
    if (Array.isArray(jsonObj.extend)) {
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
        generateCssSelector(
          child,
          selector,
          cssMap,
          mediaQueriesMap,
          siblingCountMap
        );
      }
    }
  }
}
