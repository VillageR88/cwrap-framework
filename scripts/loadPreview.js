import populateSelectOptions from "./populateSelectOptions.js";
import createElementFromJson from "./createElementFromJson.js";
import addLinks from "./addLinks.js";
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
  if (jsonObjGlobals?.head) title.textContent = jsonObjGlobals.head.title;
  else if (jsonObj.head) title.textContent = jsonObj.head.title;
  const style = doc.createElement("style");
  style.id = "custom-styles";
  if (jsonObjGlobals?.head?.base) {
    console.log("hashead")
    const base = doc.createElement("base");
    for (const [key, value] of Object.entries(jsonObjGlobals.head.base)) {
      base.setAttribute(key, value);
    }
    head.appendChild(base);
  }
  head.appendChild(metaCharset);
  head.appendChild(metaViewport);
  head.appendChild(metaKeywords);
  head.appendChild(title);
  head.appendChild(style);
  addLinks(head, jsonObjGlobals);
  addLinks(head, jsonObj);
  html.appendChild(head);
  html.appendChild(body);
  if (jsonObjGlobals?.const) {
    for (const [key, value] of Object.entries(jsonObjGlobals.const)) {
      global.map.constMap.set(key, value);
    }
  }
  generateClassroomMap(jsonObjGlobals, jsonObj);
  generateCssSelector(jsonObj, "", new Map());
  // Replace cwrapGlobal[something] in jsonObj text with global.map.constMap.get(something)
  const replaceCwrapGlobals = (obj) => {
    if (typeof obj === "string") {
      return obj.replace(/cwrapGlobal\[(.*?)\]/g, (match, p1) => {
        return global.map.constMap.get(p1) || match;
      });
    }  if (Array.isArray(obj)) {
      return obj.map(replaceCwrapGlobals);
    }  if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        obj[key] = replaceCwrapGlobals(obj[key]);
      }
    }
    return obj;
  };

  replaceCwrapGlobals(jsonObj);
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
