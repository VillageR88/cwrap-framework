/**
 * @typedef {import("../types").JsonObject} JsonObject // TODO: verify need of this import
 * @type {import('./_globals.js')}
 */
import getElementFromPath from "./getElementFromPath.js";
import populateTreeView from "./populateTreeView.js";
import generateCssSelector from "./generateCssSelector.js";
import applyStyles from "./applyStyles.js";
import populateSelectOptions from "./populateSelectOptions.js";
import serializeElement from "./serializeElement.js";
import createElementFromJson from "./createElementFromJson.js";
import updateElementInfo from "./updateElementInfo.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateStateOfContextSelectAllOptions from "./populateStateOfContextSelectAllOptions.js";
import getElementPath from "./getElementPath.js";
import highlightSelectedElement from "./highlightSelectedElement.js";

// Function to update jsonObj based on the current DOM structure
const rootMap = global.map.rootMap;
const fontMap = global.map.fontMap;
const headMap = global.map.headMap;

// Function to update the state and reflect changes

// Function to nest an element in another element
export default function nestElementInElement(draggedValue, targetValue) {
	remapStyles(draggedValue, targetValue);
	getElementFromPath(targetValue).appendChild(getElementFromPath(draggedValue));
	update();
	applyStyles();
	populateSelectOptions();
	populateStateOfContextSelectAllOptions();
	populateTreeView();
	highlightSelectedElement();
}

function remapStyles(draggedSelector, targetSelector) {
    const cssMap = global.map.cssMap;
    console.log("cssMap:", cssMap);

    console.log("draggedSelector:", draggedSelector);
    console.log("targetSelector:", targetSelector);

    const draggedStyle = cssMap.get(draggedSelector);
    console.log("draggedStyle:", draggedStyle);

    const targetStyle = cssMap.get(targetSelector);
    console.log("targetStyle:", targetStyle);

    if (draggedStyle) {
        // Update the dragged element's selector to reflect its new position
        const newDraggedSelector = `${targetSelector} > ${draggedSelector.split('>').pop().trim()}`;
        console.log(`Updating style for ${newDraggedSelector} to`, draggedStyle);
        cssMap.set(newDraggedSelector, draggedStyle);

        console.log(`Deleting style for ${draggedSelector}`);
        cssMap.delete(draggedSelector);
    }
}

function update() {
	const jsonObj = updateJsonObj(); // Update jsonObj before using it
	console.log(jsonObj);
	const doc = global.id.doc;
	global.map.cssMap.clear();
	generateCssSelector(jsonObj, "", new Map());
	const element = createElementFromJson(jsonObj);
	// global.map.cssMap.set(newElement, "");
	doc.body.replaceWith(element);
	const bodyPath = getElementPath(doc.body);
	updateElementInfo(bodyPath, doc.body);
	//populateAttributeOptions(doc);
}

function updateJsonObj() {
	/**
	 * @type {JsonObject} bodyJson
	 */
	let bodyJson = serializeElement(global.id.doc.body);
	if (rootMap.size > 0) {
		const root = {};
		for (const [key, value] of rootMap.entries()) {
			root[key] = value;
		}
		bodyJson = { root, ...bodyJson };
	}

	if (fontMap.size > 0) {
		let fonts = {};
		for (const [key, value] of fontMap.entries()) {
			fonts[key] = value;
		}
		fonts = fonts.fonts;
		bodyJson = { fonts, ...bodyJson };
	}

	if (headMap.size > 0) {
		const head = {};
		for (const [key, value] of headMap.entries()) {
			head[key] = value;
		}
		bodyJson = { head, ...bodyJson };
	}

	return bodyJson;
}
