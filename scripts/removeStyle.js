/**
 * Removes the CSS style from the map.
 *
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Map} mediaQueriesMap - The map of media queries.
 * @param {string} removedCSS - The list of selectors for removed elements.
 * @returns {void}
 */
export default function removeStyle(cssMap, mediaQueriesMap, removedCSS) {
  // console.log("Removed CSS: ", removedCSS);
  for (const key of cssMap.keys()) {
    if (removedCSS === key) {
      cssMap.delete(key);
      break;
    }
  }
}
