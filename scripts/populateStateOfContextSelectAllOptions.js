import { stateNonContextual } from "./_const.js";

export default function populateStateOfContextSelectAllOptions(
	isBlueprint = false,
) {
	const selectStateOfContext = isBlueprint
		? global.id.selectBlueprintStateOfContext
		: global.id.selectStateOfContext;
	selectStateOfContext.innerHTML = "";
	for (const element of stateNonContextual) {
		const option = document.createElement("option");
		option.value = element;
		option.textContent = element;
		selectStateOfContext.appendChild(option);
	}
}
