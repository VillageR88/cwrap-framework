export default function highlightSelectedElement() {
	const previewDocument =
		global.id.preview.contentDocument ||
		global.id.preview.contentWindow.document;
	const treeView = global.id.previewTree;
	const selectedElement = global.id.elementSelect.value;
	for (const element of treeView.querySelectorAll("button")) {
		if (element.value === selectedElement) {
			element.classList.add("cwrapHighlight");
		} else element.classList.remove("cwrapHighlight");
	}
}
