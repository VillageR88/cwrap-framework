import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import validateParentElement from "./validateParentElement.js";
import validateRemoveElement from "./validateRemoveElement.js";

export const eventListenerClickElement = (element) => {
	element.addEventListener("click", (event) => {
		if (global.id.mainInitialSelector.style.display === "none") return; // Do nothing if some elements are displayed like state
		event.stopPropagation();
		event.preventDefault();
		if (
			event.target.tagName === "A" &&
			!global.id.navSelectPreview.classList.contains("static")
		) {
			console.log("a element");
			window.location.href = event.target.href;
		}
		const fullPath = getElementPath(element);
		updateElementInfo(fullPath, element);
		validateParentElement();
		validateRemoveElement();
		// Seems obsolete because i have locked this listener to only work when mainInitialSelector is displayed
		// if (global.id.mainAttributeSelector.style.display === "flex") {
		// 	populateAttributeOptions();
		// 	populateAttributeOptionsValue();
		// } else if (global.id.mainTextEditor.style.display === "flex") {
		// 	const element = getElementFromPath();
		// 	const textContent = Array.from(element.childNodes)
		// 		.filter((node) => node.nodeType === Node.TEXT_NODE)
		// 		.map((node) => node.nodeValue.trim())
		// 		.join(" ");
		// 	global.id.mainTextEditor2.value = textContent;
		// }
	});
};

export default eventListenerClickElement;

