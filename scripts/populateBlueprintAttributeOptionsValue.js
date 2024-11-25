export default function populateBlueprintAttributeOptionsValue(targetElement) {
	const blueprintAttributeSelectValue =
		global.id.blueprintAttributeSelect.value;
	const attributeValue = blueprintAttributeSelectValue
		? targetElement.attributes[blueprintAttributeSelectValue]
		: "";
	global.id.blueprintAttributeInput.value = attributeValue || "";
}
