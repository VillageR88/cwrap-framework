import populateContextSelectAll from "./populateContextSelectAll.js";

/**
 * @param {Map<string,string> | undefined} mapContextual
 */
export default function resolveToggleContext(
	mapContextual,
	isBlueprint = false,
) {
	const stateSelectAllValue = isBlueprint
		? global.id.stateBlueprintSelectAll.value
		: global.id.stateSelectAll.value;
	const selectContext = isBlueprint
		? global.id.selectBlueprintContext
		: global.id.selectContext;
	const selectContextHighlight = isBlueprint
		? global.id.selectBlueprintContextHighlight
		: global.id.selectContextHighlight;
	const selectStateOfContext = isBlueprint
		? global.id.selectBlueprintStateOfContext
		: global.id.selectStateOfContext;
	if (stateSelectAllValue === "has") {
		selectStateOfContext.style.display = "flex";
		selectContext.style.display = "flex";
		selectContextHighlight.style.display = "flex";
		if (mapContextual) populateContextSelectAll(mapContextual, isBlueprint);
	} else {
		selectStateOfContext.style.display = "none";
		selectContext.style.display = "none";
		selectContextHighlight.style.display = "none";
	}
	if (stateSelectAllValue === "custom") {
	global.id.mainStateAdd2.style.display = "flex";
	}
	else {
	global.id.mainStateAdd2.style.display = "none";
	}

}
