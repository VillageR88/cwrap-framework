import populateSelectOptions from "./populateSelectOptions.js";
import createElementFromJson from "./createElementFromJson.js";
import generateClassroomMap from "./generateClassroomMap.js";
import generateCssSelector from "./generateCssSelector.js";
import applyStyles from "./applyStyles.js";
import addRuntimeScripts from "./addRuntimeScripts.js";
import validateParentElement from "./validateParentElement.js";
import validateRemoveElement from "./validateRemoveElement.js";
import clearDocumentByOmit from "./clearDocumentByOmit.js";
import clearDocumentFromPlaceholders from "./clearDocumentFromPlaceholders.js";
import loadCustomVisualsForCwrapEnvironment from "./loadCustomVisualsForCwrapEnvironment.js";
import populateAllCustomDevices from "./populateAllCustomDevices.js";

/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Loads the preview by fetching the skeleton body template and rendering it in the preview iframe.
 *
 * @param {JsonObject} jsonObj - The JSON object representing the skeleton body template.
 * @returns {void}
 */
export default function loadPreview(jsonObj, jsonObjGlobals) {
  const doc = global.id.doc;
  console.log(jsonObjGlobals);

  if (typeof jsonObj !== "object" || jsonObj === null) {
    throw new Error("jsonObj is not an object");
  }

  /* Does better memory cleanup than doc.documentElement.innerHTML = "" at cost of temporal insignificant CPU usage */
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
  if (jsonObjGlobals.head) title.textContent = jsonObjGlobals.head.title;
  else if (jsonObj.head) title.textContent = jsonObj.head.title;
  const style = doc.createElement("style");
  style.id = "custom-styles";
  head.appendChild(metaCharset);
  head.appendChild(metaViewport);
  head.appendChild(metaKeywords);
  head.appendChild(title);
  head.appendChild(style);
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
  generateCssSelector(jsonObj, "", new Map());
  const bodyElement = createElementFromJson(jsonObj, true);
  clearDocumentByOmit(bodyElement);
  doc.body.replaceWith(bodyElement);
  clearDocumentFromPlaceholders(jsonObj);
  addRuntimeScripts();
  applyStyles();
  loadCustomVisualsForCwrapEnvironment();
  populateAllCustomDevices();
  populateSelectOptions();
  validateRemoveElement();
  validateParentElement();
}
