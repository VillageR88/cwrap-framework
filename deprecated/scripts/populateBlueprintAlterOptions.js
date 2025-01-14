import getAlter from "./getAlter.js";

export default function populateBlueprintAlterOptions() {
	global.id.mainBlueprintAlterSelectorSelectAlter.innerHTML = "";
	for (const type of ["full", "partial", "none"]) {
		const option = document.createElement("option");
		option.value = type;
		option.textContent = type;
		global.id.mainBlueprintAlterSelectorSelectAlter.append(option);
	}
	const alterOrdinalValue = getAlter().alterSelectedValue;
	if (alterOrdinalValue) {
		global.id.mainBlueprintAlterSelectorSelectAlter.value = alterOrdinalValue;
	}
}
