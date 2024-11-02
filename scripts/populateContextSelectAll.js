import populateStateOfContextSelectAllOptions from "./populateStateOfContextSelectAllOptions.js";

export default function populateContextSelectAll(
	mapContextual,
	isBlueprint = false,
) {
	const selectContext = isBlueprint
		? global.id.selectBlueprintContext
		: global.id.selectContext;
	selectContext.innerHTML = "";
	for (const [key] of mapContextual) {
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		selectContext.appendChild(option);
	}
	populateStateOfContextSelectAllOptions(isBlueprint);
}
