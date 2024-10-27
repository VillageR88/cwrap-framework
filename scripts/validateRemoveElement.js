/**
 * Validates the remove element button based on the selected element.
 * If the selected element is the searched element (default is body), the button is disabled.
 * @param {boolean} validationForBlueprint - Check if first element is Ul element and prevent removing it.
 */
export default function validateRemoveElement(validationForBlueprint = false) {
	const selectedElementValue = validationForBlueprint
		? global.id.blueprintSelect.value
		: global.id.elementSelect.value;
	console.log(selectedElementValue);
	const removeElement = validationForBlueprint
		? global.id.mainBlueprintSelectorDelete
		: global.id.removeElement;
	console.log(removeElement);
	console.log(selectedElementValue);

	if (selectedElementValue !== (validationForBlueprint ? " > li" : "body")) {
		removeElement.removeAttribute("disabled");
		removeElement.setAttribute("title", "remove selected element");
	} else {
		removeElement.setAttribute("disabled", true);
		removeElement.setAttribute(
			"title",
			validationForBlueprint
				? "Cannot remove the ul element"
				: "Cannot remove the body element",
		);
	}
}
