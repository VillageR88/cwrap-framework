import { semanticElements } from "./_const.js";
/**
 * Populates the element select all element with sematic HTML elements like div, span, p, etc.
 */
export default function populateElementSelectAll(targetSelector = undefined) {
  const elementSelectAll = targetSelector
    ? targetSelector
    : global.id.elementSelectAll;

  //clear any existing options in the element select element before appending new options
  elementSelectAll.innerHTML = "";
  for (const element of semanticElements) {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    //append the option element to the element select element
    elementSelectAll.appendChild(option);
  }
}
