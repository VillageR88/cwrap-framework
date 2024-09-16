/**
 * @type {import('./_globals.js')}
 */
import creatorSaveHead from "./creatorSaveHead.js";
import creatorSaveFonts from "./creatorSaveFonts.js";
import creatorSaveRoot from "./creatorSaveRoot.js";

export default function creatorSave() {
	switch (global.id.sectionsVariables.value) {
		case "head":
			creatorSaveHead();
			break;
		case "fonts":
			creatorSaveFonts();
			break;
		case "root":
			creatorSaveRoot();
			break;
	}
}
