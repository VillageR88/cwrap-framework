export default function resolveElementStateSelect(isBlueprint = false) {
	//Do not use yet isBlueprint (WIP)
	const selectedElement = isBlueprint
		? global.id.elementBlueprintStateSelect
		: global.id.elementStateSelect;
	const contextInfo = isBlueprint
		? global.id.stateBlueprintContextInfo
		: global.id.stateContextInfo;mainBlueprintStateStyleContextInfo
	const mainStateStyle = isBlueprint
		? global.id.mainBlueprintStateStyleContextInfo
		: global.id.mainStateStyleContextInfo;
	if (selectedElement.value.includes(":has")) {
		mainStateStyle.style.display = "flex";
		contextInfo.value = selectedElement.value
			.split(":has")[1]
			.slice(1, -1);
		contextInfo.title = selectedElement.value;
	} else {
		mainStateStyle.style.display = "none";
		contextInfo.value = "";
		contextInfo.title = "";
	}
}
