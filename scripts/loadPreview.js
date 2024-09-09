import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import populateSelectOptions from "./populateSelectOptions.js";
import populateScreenSizeOptions from "./populateScreenSizeOptions.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateStateOfContextSelectAllOptions from "./populateStateOfContextSelectAllOptions.js";
import createElementFromJson from "./createElementFromJson.js";
import generateCssSelector from "./generateCssSelector.js";
import applyStyles from "./applyStyles.js";

/**
 * Loads the preview by fetching the skeleton body template and rendering it in the preview iframe.
 *
 * @param {string} skeletonSource - The URL of the skeleton body template JSON.
 * @param {Map} fontMap - The Map object containing font styles.
 * @param {Map} cssMap - The Map object containing CSS selectors and styles.
 * @param {Map} mediaQueriesMap - The Map object containing media queries and styles.
 * @returns {void}
 */
export default function loadPreview(
  skeletonSource,
  fontMap,
  cssMap,
  mediaQueriesMap
) {
  // Get the preview iframe element by its ID
  const preview = document.getElementById("preview");
  // Get the document object of the preview iframe
  /**
   * @type {Document} doc - The document object of the preview iframe.
   */
  const doc = preview.contentDocument || preview.contentWindow.document;

  // Construct the URL for the skeleton body template with a cache-busting query parameter
  const url = `${skeletonSource}?v=${new Date().getTime()}`;

  // Fetch the skeleton body template JSON
  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((jsonObj) => {
      // Type check to demonstrate that jsonObj is read as any
      if (typeof jsonObj !== "object" || jsonObj === null) {
        throw new Error("jsonObj is not an object");
      }

      // Clear the existing content of the preview document
      doc.open();
      doc.close();

      const head = doc.head || doc.createElement("head");
      const title = doc.createElement("title");
      title.textContent = "Preview";
      const style = doc.createElement("style");
      style.id = "custom-styles";
      const body = doc.body || doc.createElement("body");

      // Clear existing head and body content
      head.innerHTML = "";
      body.innerHTML = "";

      // Append the elements to the document
      head.appendChild(title);
      head.appendChild(style);
      if (!doc.head) doc.documentElement.appendChild(head);
      if (!doc.body) doc.documentElement.appendChild(body);

      // Generate CSS selectors for the JSON data
      generateCssSelector(
        jsonObj,
        "",
        cssMap,
        mediaQueriesMap,
        new Map(),
        fontMap
      );

      // Create the DOM element from the JSON data
      const element = createElementFromJson(
        jsonObj,
        doc,
        cssMap,
        mediaQueriesMap
      );

      // Replace the body of the preview document with the created element
      doc.body.replaceWith(element);
      // Apply the styles from the cssMap and mediaQueriesMap to the preview document
      applyStyles(cssMap, mediaQueriesMap);
      populateSelectOptions(cssMap);
      populateScreenSizeOptions(mediaQueriesMap);
      // Get the full path of the body element in the preview document
      const bodyPath = getElementPath(doc.body);
      updateElementInfo(bodyPath, doc.body, cssMap, mediaQueriesMap);
      populateAttributeOptions(doc);
      populateStateOfContextSelectAllOptions();
    });
}
