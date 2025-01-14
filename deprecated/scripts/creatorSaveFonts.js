/**
 * @type {import('./_globals.js')}
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
const fontMap = global.map.fontMap;
const fontFamily = (font) => font.querySelector(".font-family").value;
const src = (font) => font.querySelector(".src").value;
const fontDisplay = (font) => font.querySelector(".font-display").value;
/**
 * Saves the fonts from the provided HTMLCollection.
 * @param {HTMLCollection} collection - The collection of font elements to save.
 */
const collection = global.id.wizardFontsDiv.children;

export default function creatorSaveFonts() {
	fontMap.clear();
	const fontsArray = [];

	for (let i = 0; i < collection.length; i++) {
		const fontElement = collection[i];
		const fontData = {
			"font-family": fontFamily(fontElement),
			src: src(fontElement),
			"font-display": fontDisplay(fontElement),
		};
		fontsArray.push(fontData);
	}
	fontMap.set("fonts", fontsArray);
}
