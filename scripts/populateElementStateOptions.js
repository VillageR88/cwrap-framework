import updateElementInfo from "./updateElementInfo.js";
/**
 *
 * @param {Map} cssMap
 * @param {Map} mediaQueriesMap
 */
export default function populateElementStateOptions(cssMap, mediaQueriesMap) {
  const elementStateSelect = document.getElementById("elementStateSelect");
  const selectedElement = document.getElementById("elementSelect").value;
  const optionsMap = new Map();
  let firstKey;
  for (const [key, value] of cssMap) {
    if (key.includes(`${selectedElement}:`)) {
      if (!firstKey) firstKey = key;
      optionsMap.set(key, value);
    }
  }
  //elementStateSelect populate with options
  elementStateSelect.innerHTML = "";
  for (const [key, value] of optionsMap) {
    const option = document.createElement("option");
    option.value = key;
    option.text = key;
    elementStateSelect.appendChild(option);
  }
  const PREVIEW_ID = "preview";
  const preview = document.getElementById(PREVIEW_ID);
  const previewDocument =
    preview.contentDocument || preview.contentWindow.document;
  const element = previewDocument.querySelector(firstKey);
  if (firstKey) updateElementInfo(firstKey, element, cssMap, mediaQueriesMap);
  else {
    const responsiveSelect = document.getElementById("responsiveSelect");
    responsiveSelect.innerHTML = "";
    const option = document.createElement("option");
    option.textContent = "any";
    responsiveSelect.appendChild(option);
    document.getElementById("style").textContent = "";
    document.getElementById("propertySelect").innerHTML = "";
    document.getElementById("propertyInput").value = "";
    document.getElementById("attributeSelect").innerHTML = "";
    document.getElementById("attributeInput").value = "";
  }
}
