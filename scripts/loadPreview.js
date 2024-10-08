import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import populateSelectOptions from "./populateSelectOptions.js";
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
	// document.body.innerHTML = "";
	const doc = global.id.doc;
	doc.open();
	doc.close();
	if (typeof jsonObj !== "object" || jsonObj === null) {
		throw new Error("jsonObj is not an object");
	}
	while (doc.documentElement.firstChild) {
		doc.documentElement.removeChild(doc.documentElement.firstChild);
	}
	const doctype = document.implementation.createDocumentType("html", "", "");
	if (doc.doctype) {
		doc.replaceChild(doctype, doc.doctype);
	} else {
		doc.insertBefore(doctype, doc.documentElement);
	}
	const html = doc.documentElement;
	const head = doc.head || doc.createElement("head");
	const body = doc.body || doc.createElement("body");
	head.innerHTML = "";
	body.innerHTML = "";
	const title = doc.createElement("title");
	const metaCharset = doc.createElement("meta");
	metaCharset.setAttribute("charset", "UTF-8");
	const metaViewport = doc.createElement("meta");
	metaViewport.setAttribute("name", "viewport");
	metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
	if (jsonObj.head) title.textContent = jsonObj.head.title;
	const style = doc.createElement("style");
	style.id = "custom-styles";
	head.appendChild(metaCharset);
	head.appendChild(metaViewport);
	head.appendChild(title);
	head.appendChild(style);
	html.appendChild(head);
	html.appendChild(body);
	generateCssSelector(jsonObj, "", new Map());
	const element = createElementFromJson(jsonObj);
	doc.body.replaceWith(element);
	applyStyles();
	populateSelectOptions();
	const bodyPath = getElementPath(doc.body);
	updateElementInfo(bodyPath, doc.body);
	//populateAttributeOptions(doc);
	populateStateOfContextSelectAllOptions();
}
