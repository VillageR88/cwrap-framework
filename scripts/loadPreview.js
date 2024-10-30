import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import populateSelectOptions from "./populateSelectOptions.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateStateOfContextSelectAllOptions from "./populateStateOfContextSelectAllOptions.js";
import createElementFromJson from "./createElementFromJson.js";
import generateClassroomMap from "./generateClassroomMap.js";
import generateStageMap from "./generateStageMap.js";
import generateCssSelector from "./generateCssSelector.js";
import applyStyles from "./applyStyles.js";
import replaceJsonPlaceholders from "./replaceJsonPlaceholders.js";

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
	const doc = global.id.doc;

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
	const metaKeywords = doc.createElement("meta");
	metaViewport.setAttribute("name", "viewport");
	metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
	metaKeywords.setAttribute("name", "keywords");
	metaKeywords.setAttribute("content", jsonObj.head?.meta?.keywords || "");

	if (jsonObj.head) title.textContent = jsonObj.head.title;

	const style = doc.createElement("style");
	style.id = "custom-styles";

	head.appendChild(metaCharset);
	head.appendChild(metaViewport);
	head.appendChild(metaKeywords);
	head.appendChild(title);
	head.appendChild(style);

	// Add link elements
	if (jsonObj.head?.link) {
		for (let i = 0; i < jsonObj.head.link.length; i++) {
			const linkObj = jsonObj.head.link[i];
			const link = doc.createElement("link");
			for (const [key, value] of Object.entries(linkObj)) {
				link.setAttribute(key, value);
			}
			head.appendChild(link);
		}
	}

	html.appendChild(head);
	html.appendChild(body);
	generateClassroomMap(jsonObj);
	console.log(global.map.classroomMap);
	generateStageMap(jsonObj);
	generateCssSelector(jsonObj, "", new Map());
	const jsonObjReplacedPlaceholders = replaceJsonPlaceholders(jsonObj);
	const element = createElementFromJson(jsonObjReplacedPlaceholders, true);
	doc.body.replaceWith(element);
	// const mainScript = doc.createElement("script");
	// mainScript.src = "/javascript/builder.js";
	// mainScript.type = "module";
	// mainScript.customTag = "cwrapTempScript";
	// doc.body.appendChild(mainScript);
	applyStyles();
	populateSelectOptions(jsonObj);
	const bodyPath = getElementPath(doc.body);
	updateElementInfo(bodyPath, doc.body);
	populateStateOfContextSelectAllOptions(); //TODO rethink this
}
