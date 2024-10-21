import getElementFromPath from "./getElementFromPath.js";

function removeSelectedOption(selectElement, value) {
	const options = selectElement.options;
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === value) {
			selectElement.remove(i);
			break;
		}
	}
}

export default function removeAttribute() {
	const selectedAttribute = global.id.attributeSelect.value;
	console.log(selectedAttribute);

	const element = getElementFromPath();
	if (element) {
		element.removeAttribute(selectedAttribute);
	}
	removeSelectedOption(global.id.attributeSelect, selectedAttribute);
}
