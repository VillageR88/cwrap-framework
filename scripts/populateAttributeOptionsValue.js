export default function populateAttributeOptionsValue() {
	const body = global.id.preview.contentWindow.document.body;
	const selector = global.id.elementSelect;
	const attributeSelect = global.id.attributeSelect.value;
	const attributeInput = global.id.attributeInput;
	if (!selector || !attributeSelect || !attributeInput) {
		attributeInput.value = "";
		return;
	}
	const element = body.querySelector(selector.value);
	attributeInput.value = element.getAttribute(attributeSelect);
}
