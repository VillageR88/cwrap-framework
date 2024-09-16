/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */

const rootMap = global.map.rootMap;
const rootName = (root) => root.querySelector(".root-name").value;
const rootValue = (root) => root.querySelector(".root-value").value;

/**
 * Saves the root elements from the provided HTMLCollection.
 * @param {HTMLCollection} collection - The collection of root elements to save.
 */
const collection = global.id.wizardRootDiv.children;

export default function creatorSaveRoot() {
	rootMap.clear();

	for (let i = 0; i < collection.length; i++) {
		const rootElement = collection[i];
		const key = rootName(rootElement);
		const value = rootValue(rootElement);

		// Update the rootMap with the new key and value
		rootMap.set(key, value);
	}
	console.log(rootMap);
}
