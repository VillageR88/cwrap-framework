/**
 * @type {import('./_globals.js')}
 */
/**
 * Validates the parent element select based on the selected element.
 * It is being done in order to prevent appending child elements to the elements that cannot have children.
 * If parent element is the element like img, input, the select is disabled.
 * In non-blueprint mode it checks if the element is Ul to display blueprint button.
 */
export default function validateParentElement(validationForBlueprint = false) {
	const openAddElement = validationForBlueprint
		? global.id.mainBlueprintSelectorAdd
		: global.id.openAddElement;
	const selectedElementValue = validationForBlueprint
		? global.id.blueprintSelect.value
		: global.id.elementSelect.value;
	const parentType = selectedElementValue.split(">").pop().split(":")[0].trim();
	const hasCheck = selectedElementValue.split(">").pop().includes("has(");
	const hoverCheck = selectedElementValue.split(">").pop().includes("hover");

	function setElementAttributes(element, title) {
		element.setAttribute("disabled", true);
		element.setAttribute("title", title);
	}
	if (hasCheck) {
		setElementAttributes(
			openAddElement,
			"Appending child elements to the element with has() function is not allowed",
		);
	} else if (hoverCheck) {
		setElementAttributes(
			openAddElement,
			"Appending child elements to the element with hover pseudo-class is not allowed",
		);
	} else if (
		[
			"img",
			"input",
			"br",
			"hr",
			"area",
			"base",
			"col",
			"embed",
			"link",
			"meta",
			"param",
			"source",
			"track",
			"wbr",
			"has(a",
		].includes(parentType)
	) {
		setElementAttributes(
			openAddElement,
			`Cannot append child elements to the ${parentType} element`,
		);
	} else {
		openAddElement.removeAttribute("disabled");
		openAddElement.setAttribute("title", "add element");
	}
	if (!validationForBlueprint) {
		if (parentType === "ul" || parentType === "ol") {
			global.id.editBlueprint.style.display = "flex";
		} else {
			global.id.editBlueprint.style.display = "none";
		}
	} else {
		if (parentType === "li") {
			global.id.mainBlueprintSelectorCounter.style.display = "flex";
		} else {
			global.id.mainBlueprintSelectorCounter.style.display = "none";
		}
	}
}
