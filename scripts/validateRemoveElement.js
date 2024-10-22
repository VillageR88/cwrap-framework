/**
 * Validates the remove element button based on the selected element.
 * If the selected element is the body element, the button is disabled.
 */
export default function validateRemoveElement() {
	const removeElement = global.id.removeElement;
	if (global.id.elementSelect.value !== "body") {
		removeElement.removeAttribute("disabled");
		removeElement.removeAttribute("title");
	} else {
		removeElement.setAttribute("disabled", true);
		removeElement.setAttribute("title", "Cannot remove the body element");
	}
}
