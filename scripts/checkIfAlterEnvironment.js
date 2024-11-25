export default function checkIfAlterEnvironment() {
	for (const item of [
		global.id.mainBlueprintAlterSelector,
		global.id.mainBlueprintAlterSelectorTextEditor,
		global.id.mainBlueprintAlterAttributeSelector,
		global.id.mainBlueprintAlterAttributeSelectorAttributeAdd,
		global.id.mainBlueprintAlterStyleSelector,
		global.id.mainBlueprintAlterStyleSelectorStyleAdd
	])
		if (item.style.display === "flex") return true;
	return false;
}
