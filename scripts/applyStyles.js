/**
 * Applies the styles from the cssMap and mediaQueriesMap to preview document (iframe).
 *
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Map} mediaQueriesMap - The map of media queries.
 * @returns {void}
 */
export default function applyStyles(cssMap, mediaQueriesMap) {
  // Get the preview iframe element by its ID
  const preview = document.getElementById("preview");
  // Get the document object of the preview iframe
  const previewDocument =
    preview.contentDocument || preview.contentWindow.document;

  // Initialize a string to store custom styles
  let customStyles = "";

  // Iterate over each entry in the cssMap
  cssMap.forEach((value, key) => {
    // Append the CSS selector and its styles to the customStyles string
    customStyles += `${key} {${value}}\n`;
  });

  // Iterate over each entry in the mediaQueriesMap
  mediaQueriesMap.forEach((styles, query) => {
    // Append the media query to the customStyles string
    customStyles += `@media (${query}) {\n`;
    // Iterate over each style in the media query
    styles.forEach((value, key) => {
      // Append the CSS selector and its styles to the customStyles string
      customStyles += `  ${key} {${value}}\n`;
    });
    // Close the media query block
    customStyles += "}\n";
  });

  // Update the text content of the custom-styles element in the preview document with the custom styles
  previewDocument.getElementById("custom-styles").textContent = customStyles;
}
