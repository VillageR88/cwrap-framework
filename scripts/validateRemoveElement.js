const ELEMENT_SELECT_ID = "elementSelect"; 
const ELEMENT_REMOVE_ID = "removeElement";
/**
 * Validates the remove element button based on the selected element.
 * If the selected element is the body element, the button is disabled.
 */
export default function validateRemoveElement() {
    const elementRemove = document.getElementById(ELEMENT_REMOVE_ID);
    if (document.getElementById(ELEMENT_SELECT_ID).value !== "body") {
      elementRemove.removeAttribute("disabled");
      elementRemove.removeAttribute("title");
    } else {
      elementRemove.setAttribute("disabled", true);
      elementRemove.setAttribute("title", "Cannot remove the body element");
    }
}