import getHtmlAttributes from "./getHtmlAttributes.js";

/**
 * Populates the attribute select all dropdown with all the attributes of the HTML elements.
 * @param {boolean} areBlueprintAttributes - If the attributes are blueprint attributes.
 */
export default function populateAttributeSelectAll(
	areBlueprintAttributes = false,
	areAlterAttributes = false,
) {
	const attributeSelectAll = areBlueprintAttributes
		? global.id.blueprintAttributeSelectAll
		: areAlterAttributes
			? global.id.mainBlueprintAlterAttributeSelectorAttributeSelectAll
			: global.id.attributeSelectAll;
	attributeSelectAll.innerHTML = "";
	const htmlAttributes = getHtmlAttributes();
	for (const attribute of htmlAttributes) {
		const option = document.createElement("option");
		option.value = attribute;
		option.textContent = attribute;
		attributeSelectAll.appendChild(option);
	}
}
