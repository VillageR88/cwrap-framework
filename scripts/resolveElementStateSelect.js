export default function resolveElementStateSelect(isBlueprint = false) {
	//Do not use yet isBlueprint (WIP)
	const selectedElement = isBlueprint
		? global.id.stateBlueprintSelectAll
		: global.id.elementStateSelect;
	if (selectedElement.value.includes(":has")) {
		global.id.mainStateStyleContextInfo.style.display = "flex";
		global.id.stateContextInfo.value = selectedElement.value
			.split(":has")[1]
			.slice(1, -1);
		global.id.stateContextInfo.title = selectedElement.value;
		global.id.stateContextInfo.scrollLeft = 0;
	} else {
		global.id.mainStateStyleContextInfo.style.display = "none";
		global.id.stateContextInfo.value = "";
		global.id.stateContextInfo.title = "";
		global.id.stateContextInfo.scrollLeft = 0;
	}
}
