export default function checkIfAlterEnvironment() {
	const isAlter =
		global.id.mainBlueprintAlterSelector.style.display === "flex" ||
		global.id.mainBlueprintAlterSelectorTextEditor.style.display === "flex";
	return isAlter;
}
