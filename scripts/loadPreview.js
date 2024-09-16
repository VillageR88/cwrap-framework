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
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Loads the preview by fetching the skeleton body template and rendering it in the preview iframe.
 *
 * @param {JsonObject} jsonObj - The JSON object representing the skeleton body template.
 * @returns {void}
 */
export default function loadPreview(jsonObj) {
	// Get the preview iframe element by its ID
	const preview = global.id.preview;
	// Get the document object of the preview iframe
	/**
	 * @type {Document} doc - The document object of the preview iframe.
	 */
	const doc = preview.contentDocument || preview.contentWindow.document;

	// Construct the URL for the skeleton body template with a cache-busting query parameter

	// Fetch the skeleton body template JSON

	// Type check to demonstrate that jsonObj is read as any
	if (typeof jsonObj !== "object" || jsonObj === null) {
		throw new Error("jsonObj is not an object");
	}

	// Clear the existing content of the preview document
	doc.open();
	//doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
	doc.close();

	const head = doc.head || doc.createElement("head");
	const title = doc.createElement("title");
	const metaCharset = doc.createElement("meta");
	metaCharset.setAttribute("charset", "UTF-8");
	const metaViewport = doc.createElement("meta");
	metaViewport.setAttribute("name", "viewport");
	metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
	if (jsonObj.head) title.textContent = jsonObj.head.title;
	const style = doc.createElement("style");
	style.id = "custom-styles";
	const body = doc.body || doc.createElement("body");

	// Clear existing head and body content
	head.innerHTML = "";
	body.innerHTML = "";

	// Append the elements to the document
	head.appendChild(metaCharset);
	head.appendChild(metaViewport);
	head.appendChild(title);
	head.appendChild(style);
	if (!doc.head) doc.documentElement.appendChild(head);
	if (!doc.body) doc.documentElement.appendChild(body);

	// Generate CSS selectors for the JSON data
	generateCssSelector(
		jsonObj,
		"",
		global.map.cssMap,
		global.map.mediaQueriesMap,
		new Map(),
		global.map.fontMap,
	);

	// Create the DOM element from the JSON data
	const element = createElementFromJson(
		jsonObj,
		doc,
		global.map.cssMap,
		global.map.mediaQueriesMap,
	);

	// Replace the body of the preview document with the created element
	doc.body.replaceWith(element);
	// Apply the styles from the cssMap and mediaQueriesMap to the preview document
	applyStyles();
	populateSelectOptions(global.map.cssMap);
	populateScreenSizeOptions(global.map.mediaQueriesMap);
	// Get the full path of the body element in the preview document
	const bodyPath = getElementPath(doc.body);
	updateElementInfo(
		bodyPath,
		doc.body,
		global.map.cssMap,
		global.map.mediaQueriesMap,
	);
	populateAttributeOptions(doc);
	populateStateOfContextSelectAllOptions();
}
