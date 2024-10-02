import getHtmlAttributes from "./getHtmlAttributes.js";

export default function populateAttributeSelectAll() {
	const attributeSelectAll = global.id.attributeSelectAll;
	// Clear the select element
	attributeSelectAll.innerHTML = "";
	const htmlAttributes = getHtmlAttributes();
	console.log(htmlAttributes);
	for (const attribute of htmlAttributes) {
		const option = document.createElement("option");
		option.value = attribute;
		option.textContent = attribute;
		attributeSelectAll.appendChild(option);
	}
}
