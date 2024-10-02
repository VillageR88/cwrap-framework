/**
 * @type {import('./_globals.js')}
 */
/**
 * Validates the parent element select based on the selected element.
 * It is being done in order to prevent appending child elements to the elements that cannot have children.
 * If parent element is the element like img, input, the select is disabled.
 */
export default function validateParentElement() {
  const openAddElement = global.id.openAddElement;
  const selectedElement = global.id.elementSelect;
  const parentType = selectedElement.value
    .split(">")
    .pop()
    .split(":")[0]
    .trim();
  const hasCheck = selectedElement.value.split(">").pop().includes("has(");
  const hoverCheck = selectedElement.value.split(">").pop().includes("hover");

  function setElementAttributes(element, title) {
    element.setAttribute("disabled", true);
    element.setAttribute("title", title);
  }

  if (hasCheck) {
    setElementAttributes(
      openAddElement,
      "Appending child elements to the element with has() function is not allowed"
    );
  } else if (hoverCheck) {
    setElementAttributes(
      openAddElement,
      "Appending child elements to the element with hover pseudo-class is not allowed"
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
      `Cannot append child elements to the ${parentType} element`
    );
  } else {
    openAddElement.removeAttribute("disabled");
    openAddElement.setAttribute("title", "add element")
  }
}
