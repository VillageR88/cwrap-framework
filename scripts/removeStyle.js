/**
 * Removes the CSS style from the map.
 *
 * @todo Implement media queries removal.
 * @param {string} removedCSS - The prefix of selectors for removed elements.
 * @returns {void}
 */
export default function removeStyle(removedCSS) {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap; //TODO: Implement media queries removal

	// Escape special characters in the removedCSS string
	const escapedRemovedCSS = removedCSS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`^${escapedRemovedCSS}`);

	for (const key of cssMap.keys()) {
		console.log(`Key: ${key}`);
		console.log(`Regex: ${regex}`);
		console.log(`Regex Test: ${regex.test(key)}`);
		if (regex.test(key)) {
			console.log(`Deleting key: ${key}`);
			cssMap.delete(key);
		}
	}
}
