import updateElementInfo from "./updateElementInfo.js";
/**
 *
 * @param {Map} cssMap
 * @param {Map} mediaQueriesMap
 */
export default function populateElementStateOptions(cssMap, mediaQueriesMap) {
	const elementStateSelect = global.id.elementStateSelect;
	const selectedElement = global.id.elementSelect.value;
	const optionsMap = new Map();
	let firstKey;
	for (const [key, value] of cssMap) {
		if (key.includes(`${selectedElement}:`)) {
			if (!firstKey) firstKey = key;
			optionsMap.set(key, value);
		}
	}
	elementStateSelect.innerHTML = "";
	for (const [key, _] of optionsMap) {
		const option = document.createElement("option");
		option.value = key;
		option.text = key;
		elementStateSelect.appendChild(option);
	}
	const preview = global.id.preview;
	const previewDocument =
		preview.contentDocument || preview.contentWindow.document;
	const element = previewDocument.querySelector(firstKey);
	if (firstKey) updateElementInfo(firstKey, element, cssMap, mediaQueriesMap);
	else {
		const responsiveSelect = global.id.responsiveSelect;
		responsiveSelect.innerHTML = "";
		const option = document.createElement("option");
		option.textContent = "any";
		responsiveSelect.appendChild(option);
		global.id.style.textContent = "";
		global.id.propertySelect.innerHTML = "";
		global.id.propertyInput.value = "";
		global.id.attributeSelect.innerHTML = "";
		global.id.attributeInput.value = "";
	}
}
