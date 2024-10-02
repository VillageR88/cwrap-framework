/**
 * @type {import('./_globals.js')}
 */
import creatorSaveHead from "./creatorSaveHead.js";
import creatorSaveFonts from "./creatorSaveFonts.js";
import creatorSaveRoot from "./creatorSaveRoot.js";

export default function creatorSave() {
	creatorSaveHead();
	creatorSaveFonts();
	creatorSaveRoot();
}
