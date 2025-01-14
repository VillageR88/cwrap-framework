/**
 * 
 * @param {*} targetElement 
 */
export default function populateBlueprintAttributeOptions(targetElement) {
	const blueprintAttributeSelect = global.id.blueprintAttributeSelect;
	blueprintAttributeSelect.innerHTML = "";
	if (targetElement?.attributes) {
		for (const attribute in targetElement.attributes) {
			const newOption = new Option(attribute, attribute);
			blueprintAttributeSelect.appendChild(newOption);
		}
	}
}
