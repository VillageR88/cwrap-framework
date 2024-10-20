import getElementPath from "./getElementPath.js";
import updateElementInfo from "./updateElementInfo.js";
import validateParentElement from "./validateParentElement.js";
import validateRemoveElement from "./validateRemoveElement.js";

export const eventListenerClickElement = (element) => {
	element.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		if (global.id.mainInitialSelector.style.display === "none" || global.id.preview.classList.contains("cwrap-only")) return; // Do nothing if some elements are displayed like state
		if (
			event.target.tagName === "A" &&
			!event.target.href?.match("#") &&
			!global.id.navSelectPreview.classList.contains("static")
		) {
			console.log("clicked on a link");
			global.id.mask.style.display = "flex";
			global.id.popupLink.style.display = "flex";
			function handleConfirmClick() {
				window.location.href = event.target.href;
			}
			function handleRejectClick() {
				global.id.popupLinkConfirm.removeEventListener(
					"click",
					handleConfirmClick,
				);
				global.id.popupLinkReject.removeEventListener(
					"click",
					handleRejectClick,
				);
				global.id.mask.style.display = "none";
				global.id.popupLink.style.display = "none";
			}
			global.id.popupLinkConfirm.addEventListener("click", handleConfirmClick);
			global.id.popupLinkReject.addEventListener("click", handleRejectClick);
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
