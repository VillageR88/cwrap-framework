import getHtmlAttributes from "./getHtmlAttributes.js";

export default function populateAttributeSelectAll() {
	const attributeSelectAll = global.id.attributeSelectAll;
	attributeSelectAll.innerHTML = "";
	const htmlAttributes = getHtmlAttributes();
	for (const attribute of htmlAttributes) {
		const option = document.createElement("option");
		option.value = attribute;
		option.textContent = attribute;
		attributeSelectAll.appendChild(option);
	}
}
