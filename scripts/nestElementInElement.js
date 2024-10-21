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
	//console.log("Nesting element...");
	//console.log("Dragged Value:", draggedValue);
	//console.log("Target Value:", targetValue);

	remapStyles(draggedValue, targetValue);
	const targetElement = getElementFromPath(targetValue);
	const draggedElement = getElementFromPath(draggedValue);

	//console.log("Target Element:", targetElement);
	//console.log("Dragged Element:", draggedElement);

	targetElement.appendChild(draggedElement);
	update();
	applyStyles();
	populateSelectOptions();
	populateStateOfContextSelectAllOptions();
	populateTreeView();
	highlightSelectedElement();
}

function remapStyles(draggedSelector, targetSelector) {
	const cssMap = global.map.cssMap;
	//console.log("Remapping styles...");
	//console.log("CSS Map:", cssMap);

	//console.log("Dragged Selector:", draggedSelector);
	//console.log("Target Selector:", targetSelector);

	const draggedStyle = cssMap.get(draggedSelector);
	//console.log("Dragged Style:", draggedStyle);

	const targetStyle = cssMap.get(targetSelector);
	//console.log("Target Style:", targetStyle);

	if (draggedStyle) {
		// Update the dragged element's selector to reflect its new position
		const draggedElement = getElementFromPath(draggedSelector);
		const newDraggedSelector = generateNewSelector(
			draggedElement,
			targetSelector,
		);
		//console.log(`Updating style for ${newDraggedSelector} to`, draggedStyle);
		cssMap.set(newDraggedSelector, draggedStyle);

		//console.log(`Deleting style for ${draggedSelector}`);
		cssMap.delete(draggedSelector);

		// Recursively update styles for all child elements
		updateChildStyles(draggedElement, newDraggedSelector);
	}

	// Ensure the target element's styles are preserved
	if (targetStyle) {
		cssMap.set(targetSelector, targetStyle);
	}
}

function updateChildStyles(element, parentSelector) {
	const cssMap = global.map.cssMap;
	const children = element.children;

	//console.log("Updating child styles...");
	//console.log("Parent Element:", element);
	//console.log("Parent Selector:", parentSelector);
	//console.log("Children:", children);

	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const oldChildSelector = generateElementCssSelector(child);
		const newChildSelector = `${parentSelector} > ${child.tagName.toLowerCase()}:nth-of-type(${i})`;

		//console.log("Child Element:", child);
		//console.log("Old Child Selector:", oldChildSelector);
		//console.log("New Child Selector:", newChildSelector);

		const childStyle = cssMap.get(oldChildSelector);
		if (childStyle) {
			//console.log(`Updating style for ${newChildSelector} to`, childStyle);
			cssMap.set(newChildSelector, childStyle);
			//console.log(`Deleting style for ${oldChildSelector}`);
			cssMap.delete(oldChildSelector);
		} else {
			//console.log(`No style found for ${oldChildSelector}`);
		}

		// Recursively update styles for the child's children
		updateChildStyles(child, newChildSelector);
	}
}

function generateNewSelector(element, targetSelector) {
	//console.log("Generating new selector...");
	//console.log("Element:", element);
	//console.log("Target Selector:", targetSelector);

	const tagName = element.tagName.toLowerCase();
	//console.log("Tag Name:", tagName);

	const siblings = Array.from(
		getElementFromPath(targetSelector).children,
	).filter((sibling) => sibling.tagName.toLowerCase() === tagName);
	//console.log("Siblings with the same tag name:", siblings);

	const index = siblings.length + 1;
	//console.log("Index of the element among siblings:", index);

	const newSelector = `${targetSelector} > ${tagName}:nth-of-type(${index})`;
	//console.log("New Selector:", newSelector);

	return newSelector;
}

function generateElementCssSelector(element) {
	if (!element) return null;
	const parts = [];
	let currentElement = element;
	while (currentElement.parentElement) {
		const tagName = currentElement.tagName.toLowerCase();
		//console.log("Tag Name:", tagName);
		const siblings = Array.from(currentElement.parentElement.children).filter(
			(sibling) => sibling.tagName.toLowerCase() === tagName,
		);
		const index = siblings.indexOf(currentElement) + 1;
		if (["body", "main", "nav", "footer"].includes(tagName))
			parts.unshift(tagName);
		else parts.unshift(`${tagName}:nth-of-type(${index})`);
		currentElement = currentElement.parentElement;
	}
	return parts.join(" > ");
}

function update() {
	//console.log("Updating the document...");
	const jsonObj = updateJsonObj(); // Update jsonObj before using it
	//console.log("Updated JSON Object:", jsonObj);
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
	//console.log("Updating JSON object...");
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

	//console.log("Updated JSON Object:", bodyJson);
	return bodyJson;
}
